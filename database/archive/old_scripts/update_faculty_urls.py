#!/usr/bin/env python3
"""
Update Faculty URLs Script
This script properly categorizes and updates Google Scholar, ORCID, LinkedIn, and other URLs
"""

import os
import json
import mysql.connector
from pathlib import Path
import re

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Mrutyu@2026',
    'database': 'nitgoa_db',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_0900_ai_ci'
}

def connect_to_database():
    """Establish database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

def categorize_url(url):
    """Categorize URL based on its domain"""
    if not url:
        return None, None
    
    url = str(url).strip()
    
    if 'scholar.google' in url:
        return 'google_scholar', url
    elif 'orcid.org' in url:
        return 'orcid', url
    elif 'linkedin.com' in url:
        return 'linkedin', url
    elif 'researchgate.net' in url:
        return 'researchgate', url
    else:
        return 'personal_website', url

def extract_urls_from_faculty_data(faculty_data):
    """Extract and categorize URLs from faculty JSON data"""
    urls = {
        'google_scholar_url': None,
        'orcid_url': None,
        'linkedin_url': None,
        'researchgate_url': None,
        'personal_website': None
    }
    
    # Check personalInformation.url
    personal_info = faculty_data.get('personalInformation', {})
    if personal_info and personal_info.get('url'):
        url_data = personal_info.get('url')
        
        if isinstance(url_data, list):
            # Handle list of URLs
            for url in url_data:
                category, clean_url = categorize_url(url)
                if category and clean_url:
                    if category == 'google_scholar':
                        urls['google_scholar_url'] = clean_url
                    elif category == 'orcid':
                        urls['orcid_url'] = clean_url
                    elif category == 'linkedin':
                        urls['linkedin_url'] = clean_url
                    elif category == 'researchgate':
                        urls['researchgate_url'] = clean_url
                    elif category == 'personal_website' and not urls['personal_website']:
                        urls['personal_website'] = clean_url
        else:
            # Handle single URL
            category, clean_url = categorize_url(url_data)
            if category and clean_url:
                if category == 'google_scholar':
                    urls['google_scholar_url'] = clean_url
                elif category == 'orcid':
                    urls['orcid_url'] = clean_url
                elif category == 'linkedin':
                    urls['linkedin_url'] = clean_url
                elif category == 'researchgate':
                    urls['researchgate_url'] = clean_url
                elif category == 'personal_website':
                    urls['personal_website'] = clean_url
    
    # Check publications.google_scholar_link
    publications = faculty_data.get('publications', {})
    if publications and publications.get('google_scholar_link'):
        urls['google_scholar_url'] = publications.get('google_scholar_link')
    
    return urls

def update_faculty_urls():
    """Update faculty URLs in the database"""
    connection = connect_to_database()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    # Get base directory for faculty data
    base_dir = Path(__file__).parent
    data_dir = base_dir / '..' / 'client' / 'src' / 'Views' / 'People-Section' / 'Faculty' / 'FacultyDetails' / 'data'
    
    departments = ['aps_json', 'cse_json', 'cve_json', 'ece_json', 'eee_json', 'hss_json', 'mce_json']
    
    updated_count = 0
    
    for dept_dir in departments:
        dept_path = data_dir / dept_dir
        if dept_path.exists():
            print(f"Processing {dept_dir}...")
            
            for json_file in dept_path.glob('*.json'):
                try:
                    with open(json_file, 'r', encoding='utf-8') as file:
                        faculty_data = json.load(file)
                    
                    # Get faculty name for identification
                    profile = faculty_data.get('profile', {})
                    faculty_name = profile.get('name', '')
                    
                    if not faculty_name:
                        continue
                    
                    # Extract URLs
                    urls = extract_urls_from_faculty_data(faculty_data)
                    
                    # Check if we have any URLs to update
                    has_urls = any(url for url in urls.values())
                    
                    if has_urls:
                        # Update the database
                        update_query = """
                        UPDATE faculty_profiles 
                        SET google_scholar_url = %s, 
                            orcid_url = %s, 
                            linkedin_url = %s, 
                            researchgate_url = %s,
                            personal_website = %s
                        WHERE full_name = %s
                        """
                        
                        cursor.execute(update_query, (
                            urls['google_scholar_url'],
                            urls['orcid_url'],
                            urls['linkedin_url'],
                            urls['researchgate_url'],
                            urls['personal_website'],
                            faculty_name
                        ))
                        
                        if cursor.rowcount > 0:
                            updated_count += 1
                            print(f"Updated URLs for: {faculty_name}")
                            if urls['google_scholar_url']:
                                print(f"  - Google Scholar: {urls['google_scholar_url']}")
                            if urls['orcid_url']:
                                print(f"  - ORCID: {urls['orcid_url']}")
                            if urls['linkedin_url']:
                                print(f"  - LinkedIn: {urls['linkedin_url']}")
                            if urls['researchgate_url']:
                                print(f"  - ResearchGate: {urls['researchgate_url']}")
                            if urls['personal_website']:
                                print(f"  - Personal Website: {urls['personal_website']}")
                
                except Exception as e:
                    print(f"Error processing {json_file}: {e}")
    
    connection.commit()
    connection.close()
    
    print(f"\\nUpdated URLs for {updated_count} faculty members!")

if __name__ == "__main__":
    print("Starting Faculty URLs Update...")
    update_faculty_urls()
    print("Faculty URLs update completed!")
