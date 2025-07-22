#!/usr/bin/env python3
"""
Faculty Data Migration Script - Fixed Version
This script handles edge cases and fixes the failed faculty files
"""

import os
import json
import re
import mysql.connector
from datetime import datetime
from pathlib import Path
import sys

# Database configuration from server .env
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
        sys.exit(1)

def clean_text(text):
    """Clean and normalize text data"""
    if not text:
        return None
    if isinstance(text, list):
        text = ', '.join(str(item) for item in text)
    return str(text).strip()

def safe_get_url(url_field):
    """Safely extract URL from field that might be a list or string"""
    if not url_field:
        return None
    if isinstance(url_field, list):
        return url_field[0] if url_field else None
    return str(url_field)

def extract_department_from_filename(filepath):
    """Extract department from file path"""
    path_parts = str(filepath).split('/')
    for part in path_parts:
        if part.endswith('_json'):
            dept = part.replace('_json', '').upper()
            # Map department codes
            dept_mapping = {
                'CSE': 'CSE',
                'ECE': 'ECE', 
                'EEE': 'EEE',
                'MCE': 'MCE',
                'CVE': 'CVE',
                'HSS': 'HSS',
                'APS': 'APS'
            }
            return dept_mapping.get(dept, 'CSE')
    return 'CSE'

def safe_extract_email(profile, contact_info, personal_info):
    """Safely extract email from various sources"""
    # Try profile first
    email = profile.get('email') if isinstance(profile, dict) else None
    if email:
        return email
        
    # Try contact info
    email = contact_info.get('email') if isinstance(contact_info, dict) else None
    if email:
        return email
        
    # Try personal info
    email = personal_info.get('email') if isinstance(personal_info, dict) else None
    if email:
        return email
        
    # Generate a placeholder email based on name
    name = profile.get('name') if isinstance(profile, dict) else ''
    if name:
        clean_name = name.lower().replace('dr. ', '').replace(' ', '.').replace('.', '')
        return f"{clean_name}@nitgoa.ac.in"
    
    return 'unknown@nitgoa.ac.in'

def parse_date(date_str):
    """Parse date string in various formats"""
    if not date_str:
        return None
    
    date_str = str(date_str).strip()
    
    # Try different date formats
    formats = ['%d/%m/%Y', '%Y-%m-%d', '%d-%m-%Y', '%m/%d/%Y']
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    
    return None

def safe_insert_faculty_profile(cursor, faculty_data, department):
    """Safely insert faculty profile data with error handling"""
    try:
        # Handle both string and dict formats for faculty data sections
        if isinstance(faculty_data, str):
            faculty_data = json.loads(faculty_data)
            
        profile = faculty_data.get('profile', {})
        personal_info = faculty_data.get('personalInformation', {})
        contact_info = faculty_data.get('contactInformation', {})
        
        # Handle cases where these might be strings instead of dicts
        if isinstance(profile, str):
            profile = {}
        if isinstance(personal_info, str):
            personal_info = {}
        if isinstance(contact_info, str):
            contact_info = {}
        
        # Extract name parts
        full_name = profile.get('name') or personal_info.get('name', 'Unknown Faculty')
        name_parts = full_name.replace('Dr. ', '').replace('Prof. ', '').strip().split()
        first_name = name_parts[0] if name_parts else 'Unknown'
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        # Prepare research areas
        research_areas = faculty_data.get('researchAreas', [])
        research_area_summary = profile.get('researchAreaSummary', [])
        
        research_areas_text = clean_text(research_areas) if research_areas else None
        research_summary_text = clean_text(research_area_summary) if research_area_summary else None
        
        # Check if HOD
        designation = profile.get('designation', '')
        is_hod = 1 if 'head' in designation.lower() or 'hod' in designation.lower() else 0
        
        # Parse joining date
        joining_date = parse_date(personal_info.get('dateOfJoining'))
        birth_date = parse_date(personal_info.get('birthDate'))
        
        # Safely get email
        email = safe_extract_email(profile, contact_info, personal_info)
        
        # Safely get URL
        personal_website = safe_get_url(personal_info.get('url'))
        
        faculty_query = """
        INSERT INTO faculty_profiles (
            first_name, last_name, full_name, email, phone, mobile,
            department, designation, research_areas, research_area_summary,
            experience_description, date_of_joining, date_of_birth, gender,
            address, profile_image, personal_website, is_hod, is_active
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        faculty_values = (
            first_name,
            last_name,
            full_name,
            email,
            contact_info.get('phone'),
            contact_info.get('phoneMobile'),
            department,
            designation,
            research_areas_text,
            research_summary_text,
            personal_info.get('experience'),
            joining_date,
            birth_date,
            personal_info.get('gender'),
            contact_info.get('address'),
            profile.get('imageUrl'),
            personal_website,
            is_hod,
            1
        )
        
        cursor.execute(faculty_query, faculty_values)
        return cursor.lastrowid
        
    except Exception as e:
        print(f"Error in safe_insert_faculty_profile: {e}")
        raise

def process_failed_files():
    """Process the failed files specifically"""
    failed_files = [
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/aps_json/Saidi_Reddy_Parne.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Meenakshi_Panda.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cve_json/Saurabh_Upadhyay.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json/Devesh_Dwivedi.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/hss_json/Vishnupad_Barve.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json/Animesh_Chatterjee.json',
        '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json/Darius_Diogo_Barreto.json'
    ]
    
    connection = connect_to_database()
    cursor = connection.cursor()
    
    successful = 0
    
    for filepath in failed_files:
        try:
            print(f"Processing failed file: {filepath}")
            
            with open(filepath, 'r', encoding='utf-8') as file:
                faculty_data = json.load(file)
            
            department = extract_department_from_filename(filepath)
            
            # Insert faculty profile
            faculty_id = safe_insert_faculty_profile(cursor, faculty_data, department)
            print(f"Successfully inserted: {faculty_data.get('profile', {}).get('name', 'Unknown')} (ID: {faculty_id})")
            
            # Insert related data (simplified for now)
            if faculty_data.get('academicInformation'):
                try:
                    for i, edu in enumerate(faculty_data.get('academicInformation', [])):
                        if isinstance(edu, dict):
                            query = """
                            INSERT INTO faculty_academic_info (
                                faculty_id, degree, institute, year, subject, display_order
                            ) VALUES (%s, %s, %s, %s, %s, %s)
                            """
                            values = (
                                faculty_id,
                                edu.get('degree'),
                                edu.get('institute'),
                                str(edu.get('year', '')),
                                edu.get('subject'),
                                i
                            )
                            cursor.execute(query, values)
                except Exception as e:
                    print(f"Warning: Could not insert academic info: {e}")
            
            # Insert publications
            if faculty_data.get('publications'):
                try:
                    publications = faculty_data.get('publications', {})
                    for pub_type, pubs in publications.items():
                        if pubs and isinstance(pubs, list):
                            for pub in pubs:
                                query = """
                                INSERT INTO faculty_publications (
                                    faculty_id, publication_type, full_citation
                                ) VALUES (%s, %s, %s)
                                """
                                cursor.execute(query, (faculty_id, 'journal' if pub_type == 'journal' else 'conference', str(pub)))
                except Exception as e:
                    print(f"Warning: Could not insert publications: {e}")
            
            connection.commit()
            successful += 1
            
        except Exception as e:
            print(f"Failed to process {filepath}: {e}")
            connection.rollback()
    
    connection.close()
    print(f"\\nFixed {successful} out of {len(failed_files)} failed files")

if __name__ == "__main__":
    process_failed_files()
