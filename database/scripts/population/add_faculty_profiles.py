#!/usr/bin/env python3
"""
Add Faculty Profiles Script

This script adds faculty profiles for existing faculty members who don't have profiles yet.
"""

import sys
import json
import mysql.connector
from pathlib import Path

def get_db_connection():
    """Get database connection"""
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Mrutyu@2026',
        database='updated_nitgoa'
    )

def load_faculty_data():
    """Load faculty data from JSON file"""
    faculty_file = Path(__file__).parent / 'staff_data' / 'faculty.json'
    with open(faculty_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def insert_faculty_profile(cursor, employee_id, faculty_data):
    """Insert faculty profile data"""
    
    # Handle other_social_links JSON field
    other_social_links = faculty_data.get('other_social_links')
    if other_social_links and isinstance(other_social_links, dict):
        other_social_links_json = json.dumps(other_social_links)
    else:
        other_social_links_json = None
    
    # Handle research_interests JSON field
    research_interests = faculty_data.get('research_interests')
    if research_interests and isinstance(research_interests, list):
        research_interests_json = json.dumps(research_interests)
    else:
        research_interests_json = None
    
    profile_fields = {
        'employee_id': employee_id,
        'department_id': faculty_data.get('department_id'),
        'designation_id': faculty_data.get('designation_id'),
        'gender': faculty_data.get('gender'),
        'date_of_birth': faculty_data.get('date_of_birth'),
        'research_teaching_experience': faculty_data.get('research_teaching_experience'),
        'address': faculty_data.get('address'),
        'office_location': faculty_data.get('office_location'),
        'office_hours': faculty_data.get('office_hours'),
        'linkedin_url': faculty_data.get('linkedin_url'),
        'personal_website_url': faculty_data.get('personal_website_url'),
        'google_scholar_url': faculty_data.get('google_scholar_url'),
        'orcid_id': faculty_data.get('orcid_id'),
        'scopus_id': faculty_data.get('scopus_id'),
        'research_gate_url': faculty_data.get('research_gate_url'),
        'other_social_links': other_social_links_json,
        'bio_summary': faculty_data.get('bio_summary'),
        'research_interests': research_interests_json
    }
    
    insert_query = """
        INSERT INTO faculty_profiles (
            employee_id, department_id, designation_id, gender, date_of_birth,
            research_teaching_experience, address, office_location, office_hours,
            linkedin_url, personal_website_url, google_scholar_url, orcid_id,
            scopus_id, research_gate_url, other_social_links, bio_summary,
            research_interests
        ) VALUES (
            %(employee_id)s, %(department_id)s, %(designation_id)s, %(gender)s,
            %(date_of_birth)s, %(research_teaching_experience)s, %(address)s,
            %(office_location)s, %(office_hours)s, %(linkedin_url)s,
            %(personal_website_url)s, %(google_scholar_url)s, %(orcid_id)s,
            %(scopus_id)s, %(research_gate_url)s, %(other_social_links)s,
            %(bio_summary)s, %(research_interests)s
        )
    """
    
    cursor.execute(insert_query, profile_fields)

def main():
    print("🎓 Adding Faculty Profiles")
    print("=" * 50)
    
    # Load faculty data
    faculty_data = load_faculty_data()
    
    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Get faculty members without profiles
        cursor.execute("""
            SELECT e.employee_id, e.employee_code, e.full_name 
            FROM employees e 
            LEFT JOIN faculty_profiles fp ON e.employee_id = fp.employee_id 
            WHERE (e.role LIKE '%Professor%' OR e.role LIKE '%Faculty%') 
            AND fp.employee_id IS NULL
            ORDER BY e.display_order
        """)
        
        faculty_without_profiles = cursor.fetchall()
        
        if not faculty_without_profiles:
            print("✓ All faculty members already have profiles")
            return
        
        print(f"Found {len(faculty_without_profiles)} faculty members without profiles")
        
        # Create profiles for each faculty member
        for faculty_member in faculty_without_profiles:
            employee_code = faculty_member['employee_code']
            employee_id = faculty_member['employee_id']
            full_name = faculty_member['full_name']
            
            # Find matching data in JSON
            faculty_json_data = None
            for faculty in faculty_data['faculty']:
                if faculty['employee_code'] == employee_code:
                    faculty_json_data = faculty
                    break
            
            if faculty_json_data:
                try:
                    insert_faculty_profile(cursor, employee_id, faculty_json_data)
                    print(f"  ✓ Created profile for {employee_code} - {full_name}")
                except Exception as e:
                    print(f"  ✗ Error creating profile for {employee_code}: {e}")
            else:
                print(f"  ⚠ No JSON data found for {employee_code} - {full_name}")
        
        # Commit changes
        conn.commit()
        print("\n✓ All faculty profiles created successfully")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
