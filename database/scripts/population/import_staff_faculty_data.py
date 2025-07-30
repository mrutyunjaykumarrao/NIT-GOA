#!/usr/bin/env python3
"""
Staff and Faculty Data Import Script - Simplified Version

This script imports administrative staff, technical staff, and faculty data from JSON files
into the database. It populates both the employees table and the respective profile tables
(staff_profiles, faculty_profiles).

Usage:
    python import_staff_faculty_data.py [--dry-run] [--type staff|faculty|all]
    
Options:
    --dry-run: Show what would be imported without making actual changes
    --type: Import specific type of data (staff, faculty, or all)
"""

import sys
import os
import argparse
import json
from pathlib import Path
from datetime import datetime

def get_db_connection():
    """Get database connection"""
    try:
        import mysql.connector
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='Mrutyu@2026',
            database='updated_nitgoa'
        )
    except ImportError:
        print("Error: mysql-connector-python not installed. Please install it:")
        print("pip install mysql-connector-python")
        sys.exit(1)

def load_json_data(file_path):
    """Load data from JSON file"""
    if not file_path.exists():
        print(f"Warning: JSON file not found at {file_path}")
        return {}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON file {file_path}: {e}")
        return {}

def validate_employee_data(employee_data, employee_type):
    """Validate required fields for employee data"""
    required_fields = ['employee_code', 'full_name', 'email', 'role']
    
    # For faculty, we still require department and designation
    if employee_type == 'faculty':
        required_fields.extend(['department_id', 'designation_id'])
    
    missing_fields = []
    for field in required_fields:
        if field not in employee_data or not employee_data[field]:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"Warning: Missing required fields for {employee_data.get('employee_code', 'unknown')}: {missing_fields}")
        return False
    
    return True

def insert_employee(cursor, employee_data, employee_category):
    """Insert employee into employees table"""
    
    employee_fields = {
        'employee_code': employee_data.get('employee_code'),
        'full_name': employee_data.get('full_name'),
        'honorific': employee_data.get('honorific'),
        'email': employee_data.get('email'),
        'phone_mobile': employee_data.get('phone_mobile'),
        'phone_office': employee_data.get('phone_office'),
        'extension_no': employee_data.get('extension_no'),
        'date_of_joining': employee_data.get('date_of_joining'),
        'date_of_leaving': employee_data.get('date_of_leaving'),
        'role': employee_category,  # Use the category instead of job title
        'job_title': employee_data.get('role'),  # Store the specific job title here
        'is_hod': employee_data.get('is_hod', False),
        'employment_status': employee_data.get('employment_status', 'Permanent'),
        'employment_type': employee_data.get('employment_type', 'Full-time'),
        'image_url': employee_data.get('image_url'),
        'is_active': employee_data.get('is_active', True),
        'is_public_visible': employee_data.get('is_public_visible', True),
        'display_order': employee_data.get('display_order', 0)
    }
    
    insert_query = """
        INSERT INTO employees (
            employee_code, full_name, honorific, email, phone_mobile, phone_office, 
            extension_no, date_of_joining, date_of_leaving, role, job_title, is_hod,
            employment_status, employment_type, image_url, is_active, 
            is_public_visible, display_order
        ) VALUES (
            %(employee_code)s, %(full_name)s, %(honorific)s, %(email)s, %(phone_mobile)s, 
            %(phone_office)s, %(extension_no)s, %(date_of_joining)s, 
            %(date_of_leaving)s, %(role)s, %(job_title)s, %(is_hod)s, %(employment_status)s, 
            %(employment_type)s, %(image_url)s, %(is_active)s, 
            %(is_public_visible)s, %(display_order)s
        )
    """
    
    cursor.execute(insert_query, employee_fields)
    return cursor.lastrowid

def insert_staff_profile(cursor, employee_id, staff_data):
    """Insert staff profile data - simplified schema"""
    
    profile_fields = {
        'employee_id': employee_id,
        'department_id': staff_data.get('department_id'),
        'specialty': staff_data.get('specialty')
    }
    
    insert_query = """
        INSERT INTO staff_profiles (
            employee_id, department_id, specialty
        ) VALUES (
            %(employee_id)s, %(department_id)s, %(specialty)s
        )
    """
    
    cursor.execute(insert_query, profile_fields)

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

def check_existing_employee(cursor, employee_code):
    """Check if employee already exists"""
    cursor.execute("SELECT employee_id FROM employees WHERE employee_code = %s", (employee_code,))
    result = cursor.fetchone()
    return result[0] if result else None

def import_staff_data(cursor, data_dir, dry_run=False):
    """Import administrative and technical staff data"""
    
    # Administrative Staff
    admin_file = data_dir / "administrative_staff.json"
    admin_data = load_json_data(admin_file)
    
    admin_staff = admin_data.get('administrative_staff', [])
    print(f"Found {len(admin_staff)} administrative staff members")
    
    admin_inserted = 0
    admin_skipped = 0
    
    for staff in admin_staff:
        if not validate_employee_data(staff, 'staff'):
            admin_skipped += 1
            continue
            
        existing_id = check_existing_employee(cursor, staff['employee_code'])
        if existing_id:
            print(f"  Skipping existing employee: {staff['employee_code']}")
            admin_skipped += 1
            continue
        
        if not dry_run:
            try:
                employee_id = insert_employee(cursor, staff, 'Administrative')
                insert_staff_profile(cursor, employee_id, staff)
                admin_inserted += 1
                print(f"  ✓ Inserted: {staff['employee_code']} - {staff['full_name']}")
            except Exception as e:
                print(f"  ✗ Error inserting {staff['employee_code']}: {e}")
                admin_skipped += 1
        else:
            print(f"  [DRY RUN] Would insert: {staff['employee_code']} - {staff['full_name']}")
            admin_inserted += 1
    
    # Technical Staff
    tech_file = data_dir / "technical_staff.json"
    tech_data = load_json_data(tech_file)
    
    tech_staff = tech_data.get('technical_staff', [])
    print(f"\\nFound {len(tech_staff)} technical staff members")
    
    tech_inserted = 0
    tech_skipped = 0
    
    for staff in tech_staff:
        if not validate_employee_data(staff, 'staff'):
            tech_skipped += 1
            continue
            
        existing_id = check_existing_employee(cursor, staff['employee_code'])
        if existing_id:
            print(f"  Skipping existing employee: {staff['employee_code']}")
            tech_skipped += 1
            continue
        
        if not dry_run:
            try:
                employee_id = insert_employee(cursor, staff, 'Technical')
                insert_staff_profile(cursor, employee_id, staff)
                tech_inserted += 1
                print(f"  ✓ Inserted: {staff['employee_code']} - {staff['full_name']}")
            except Exception as e:
                print(f"  ✗ Error inserting {staff['employee_code']}: {e}")
                tech_skipped += 1
        else:
            print(f"  [DRY RUN] Would insert: {staff['employee_code']} - {staff['full_name']}")
            tech_inserted += 1
    
    return {
        'admin_inserted': admin_inserted,
        'admin_skipped': admin_skipped,
        'tech_inserted': tech_inserted,
        'tech_skipped': tech_skipped
    }

def import_faculty_data(cursor, data_dir, dry_run=False):
    """Import faculty data"""
    
    faculty_file = data_dir / "faculty.json"
    faculty_data = load_json_data(faculty_file)
    
    faculty = faculty_data.get('faculty', [])
    print(f"Found {len(faculty)} faculty members")
    
    faculty_inserted = 0
    faculty_skipped = 0
    
    for fac in faculty:
        if not validate_employee_data(fac, 'faculty'):
            faculty_skipped += 1
            continue
            
        existing_id = check_existing_employee(cursor, fac['employee_code'])
        if existing_id:
            print(f"  Skipping existing employee: {fac['employee_code']}")
            faculty_skipped += 1
            continue
        
        if not dry_run:
            try:
                employee_id = insert_employee(cursor, fac, 'Faculty')
                insert_faculty_profile(cursor, employee_id, fac)
                faculty_inserted += 1
                print(f"  ✓ Inserted: {fac['employee_code']} - {fac['full_name']}")
            except Exception as e:
                print(f"  ✗ Error inserting {fac['employee_code']}: {e}")
                faculty_skipped += 1
        else:
            print(f"  [DRY RUN] Would insert: {fac['employee_code']} - {fac['full_name']}")
            faculty_inserted += 1
    
    return {
        'faculty_inserted': faculty_inserted,
        'faculty_skipped': faculty_skipped
    }

def main():
    parser = argparse.ArgumentParser(description='Import staff and faculty data')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be imported without making actual changes')
    parser.add_argument('--type', choices=['staff', 'faculty', 'all'], default='all',
                       help='Type of data to import')
    
    args = parser.parse_args()
    
    print("👥 Staff and Faculty Data Import Script")
    print("=" * 50)
    
    if args.dry_run:
        print("🔍 Running in DRY RUN mode - no changes will be made")
    
    # Get database connection
    connection = get_db_connection()
    
    if not connection:
        print("Error: Could not establish database connection")
        return False
    
    try:
        cursor = connection.cursor()
        
        # Get data directory
        data_dir = Path(__file__).parent / "staff_data"
        
        results = {}
        
        if args.type in ['staff', 'all']:
            print("\\n📋 Importing Staff Data...")
            staff_results = import_staff_data(cursor, data_dir, args.dry_run)
            results.update(staff_results)
        
        if args.type in ['faculty', 'all']:
            print("\\n👨‍🏫 Importing Faculty Data...")
            faculty_results = import_faculty_data(cursor, data_dir, args.dry_run)
            results.update(faculty_results)
        
        if not args.dry_run:
            connection.commit()
            print("\\n✓ All changes committed to database")
        
        # Print summary
        print("\\n📊 Import Summary:")
        print("-" * 30)
        
        if 'admin_inserted' in results:
            print(f"Administrative Staff - Inserted: {results['admin_inserted']}, Skipped: {results['admin_skipped']}")
        if 'tech_inserted' in results:
            print(f"Technical Staff - Inserted: {results['tech_inserted']}, Skipped: {results['tech_skipped']}")
        if 'faculty_inserted' in results:
            print(f"Faculty - Inserted: {results['faculty_inserted']}, Skipped: {results['faculty_skipped']}")
        
        total_inserted = sum([v for k, v in results.items() if 'inserted' in k])
        total_skipped = sum([v for k, v in results.items() if 'skipped' in k])
        
        print(f"\\nTotal - Inserted: {total_inserted}, Skipped: {total_skipped}")
        
        if args.dry_run:
            print("\\n🔍 DRY RUN completed - Run without --dry-run to apply changes")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        if not args.dry_run:
            connection.rollback()
        return False
    finally:
        connection.close()

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
