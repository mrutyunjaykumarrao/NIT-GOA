#!/usr/bin/env python3
"""
Add Missing Faculty from Short Profile Data
This script identifies faculty from faculty_shortProfile.json who are not in the database
and adds them with the available information.
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

def get_existing_faculty_emails():
    """Get list of existing faculty emails from database"""
    connection = connect_to_database()
    if not connection:
        return set()
    
    cursor = connection.cursor()
    cursor.execute("SELECT email FROM faculty_profiles WHERE email IS NOT NULL AND email != ''")
    existing_emails = {row[0].lower() for row in cursor.fetchall()}
    connection.close()
    return existing_emails

def parse_department_name(dept_string):
    """Parse department string to get standardized department code"""
    dept_mapping = {
        'computer science and engineering': 'CSE',
        'electronics and communication engineering': 'ECE', 
        'electrical and electronics engineering': 'EEE',
        'mechanical engineering': 'MCE',
        'civil engineering': 'CVE',
        'applied sciences': 'APS',
        'humanities and social sciences': 'HSS'
    }
    
    dept_lower = dept_string.lower().replace('department of ', '')
    return dept_mapping.get(dept_lower, 'OTHER')

def parse_faculty_name(name):
    """Parse faculty name to extract first and last name"""
    # Remove titles
    name = re.sub(r'^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*', '', name)
    
    # Split name
    parts = name.strip().split()
    if len(parts) == 1:
        return parts[0], ''
    elif len(parts) == 2:
        return parts[0], parts[1]
    else:
        # For multiple parts, first is first name, rest is last name
        return parts[0], ' '.join(parts[1:])

def add_missing_faculty():
    """Add missing faculty from short profile data"""
    connection = connect_to_database()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    # Get existing faculty emails
    existing_emails = get_existing_faculty_emails()
    print(f"Found {len(existing_emails)} existing faculty in database")
    
    # Load short profile data
    short_profile_path = Path(__file__).parent / '..' / 'client' / 'src' / 'Views' / 'People-Section' / 'Faculty' / 'FacultyDetails' / 'data' / 'faculty_shortProfile.json'
    
    try:
        with open(short_profile_path, 'r', encoding='utf-8') as file:
            faculty_list = json.load(file)
    except Exception as e:
        print(f"Error reading short profile file: {e}")
        return
    
    added_count = 0
    skipped_count = 0
    
    for faculty in faculty_list:
        # Skip entries without required fields
        if not faculty.get('name') or not faculty.get('email'):
            if faculty.get('name'):
                print(f"Skipping {faculty['name']} - no email")
                skipped_count += 1
            continue
        
        email = faculty['email'].strip().lower()
        
        # Skip if already exists
        if email in existing_emails:
            print(f"Skipping {faculty['name']} - already exists")
            skipped_count += 1
            continue
        
        # Parse faculty data
        first_name, last_name = parse_faculty_name(faculty['name'])
        full_name = faculty['name']
        department = parse_department_name(faculty.get('department', ''))
        designation = faculty.get('designation', '')
        research_area = faculty.get('research_area', '')
        phone = faculty.get('extension_no', '')
        
        # Set default values
        is_hod = 1 if 'head' in designation.lower() else 0
        
        try:
            # Insert faculty profile
            insert_query = """
            INSERT INTO faculty_profiles (
                first_name, last_name, full_name, email, phone, 
                department, designation, research_areas,
                is_hod, is_active, display_order
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(insert_query, (
                first_name, last_name, full_name, email, phone,
                department, designation, research_area,
                is_hod, 1, 999
            ))
            
            added_count += 1
            print(f"Added: {full_name} ({email}) - {department}")
            
        except mysql.connector.Error as err:
            print(f"Error adding {full_name}: {err}")
    
    connection.commit()
    connection.close()
    
    print(f"\\nSummary:")
    print(f"- Added: {added_count} new faculty")
    print(f"- Skipped: {skipped_count} faculty (already exist or missing data)")

if __name__ == "__main__":
    print("Adding missing faculty from short profile data...")
    add_missing_faculty()
    print("Completed!")
