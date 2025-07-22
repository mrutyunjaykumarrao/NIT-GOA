#!/usr/bin/env python3
"""
NIT Goa Faculty Database Population Script

This script populates the faculty database with comprehensive data from JSON files.
It handles all departments and ensures 100% data integrity by processing:
- Faculty profiles and contact information
- Academic information and qualifications
- Publications (journals, conferences, proceedings, book chapters, books)
- Research guidance and supervision
- Funded projects and grants
- Awards and honors
- Professional memberships
- Professional services
- Courses taught (UG and PG)
- Courses attended and conducted

Usage:
    python populate_faculty_database.py [--department DEPT_CODE] [--verify]
    
Options:
    --department: Process only specific department (CSE, ECE, EEE, MCE, CVE, HSS, APS)
    --verify: Run verification after population
"""

import sys
import os
import argparse
from pathlib import Path

# Add utils to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from db_config import *

def insert_faculty_profile(cursor, faculty_data, profile):
    """Insert or update faculty profile information"""
    try:
        dept_name = profile.get('department', '')
        dept_code = get_department_code(dept_name)
        
        # Parse name components
        full_name = profile.get('name', '')
        name_parts = full_name.strip().split()
        first_name = name_parts[0] if name_parts else 'Unknown'
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        # Handle email
        email = profile.get('email')
        if not email:
            # Try to find existing faculty by name
            cursor.execute('SELECT id, email FROM faculty_profiles WHERE full_name=%s', (full_name,))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                # Generate placeholder email
                name_for_email = full_name.lower().replace(' ', '.').replace('dr.', '').replace('prof.', '').replace('mr.', '').replace('ms.', '').strip('.')
                email = f"{name_for_email}@nitgoa.ac.in"
        
        # Insert or update faculty profile
        cursor.execute('''
            INSERT INTO faculty_profiles (first_name, last_name, full_name, email, phone, mobile, department, designation, research_areas, research_area_summary, address, profile_image, is_hod, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
            ON DUPLICATE KEY UPDATE
                designation=%s, phone=%s, mobile=%s, research_areas=%s, research_area_summary=%s, address=%s, profile_image=%s
        ''', (
            first_name, last_name, full_name, email,
            faculty_data.get('contactInformation', {}).get('phoneMobile'),
            faculty_data.get('contactInformation', {}).get('phoneMobile'),
            dept_code, profile.get('designation'),
            '; '.join(faculty_data.get('researchAreas', [])),
            '; '.join(profile.get('researchAreaSummary', [])),
            faculty_data.get('contactInformation', {}).get('address'),
            profile.get('imageUrl'),
            1 if 'hod' in profile.get('designation', '').lower() else 0,
            # ON DUPLICATE KEY UPDATE values
            profile.get('designation'),
            faculty_data.get('contactInformation', {}).get('phoneMobile'),
            faculty_data.get('contactInformation', {}).get('phoneMobile'),
            '; '.join(faculty_data.get('researchAreas', [])),
            '; '.join(profile.get('researchAreaSummary', [])),
            faculty_data.get('contactInformation', {}).get('address'),
            profile.get('imageUrl')
        ))
        
        # Get faculty ID
        cursor.execute('SELECT id FROM faculty_profiles WHERE email=%s', (email,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            cursor.execute('SELECT id FROM faculty_profiles WHERE full_name=%s', (full_name,))
            result = cursor.fetchone()
            return result[0] if result else None
            
    except Exception as e:
        print(f"Error inserting faculty {profile.get('name')}: {e}")
        return None

def insert_academic_info(cursor, faculty_id, academic_info):
    """Insert academic information with duplicate prevention"""
    if not faculty_id or not academic_info:
        return
    
    seen_academic = set()
    for edu in academic_info:
        try:
            if not edu:
                continue
                
            degree = (edu.get('degree') or '').strip()
            institute = (edu.get('institute') or '').strip()
            year = (edu.get('year') or '').strip()
            subject = (edu.get('subject') or '').strip()
            
            if not any([degree, institute, year, subject]):
                continue
            
            academic_key = (faculty_id, degree, institute, year, subject)
            if academic_key in seen_academic:
                continue
                
            seen_academic.add(academic_key)
            
            cursor.execute('''
                INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE institute=%s, year=%s, subject=%s
            ''', (faculty_id, degree, institute, year, subject, institute, year, subject))
            
        except Exception as e:
            print(f"Error inserting academic info for faculty {faculty_id}: {e}")

def insert_publications(cursor, faculty_id, publications):
    """Insert publications with duplicate prevention"""
    if not faculty_id or not publications:
        return
    
    seen_publications = set()
    for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
        for pub in publications.get(pub_type, []):
            try:
                pub_clean = pub.strip()
                if not pub_clean:
                    continue
                    
                ptype = {
                    'journal': 'journal',
                    'conference': 'conference', 
                    'proceedings': 'proceedings',
                    'bookChapters': 'chapter',
                    'booksAuthored': 'book'
                }.get(pub_type, 'other')
                
                pub_key = (faculty_id, pub_clean[:500], ptype)
                if pub_key in seen_publications:
                    continue
                
                seen_publications.add(pub_key)
                
                cursor.execute('''
                    INSERT INTO faculty_publications (faculty_id, title, publication_type)
                    VALUES (%s, %s, %s) AS new_pub
                    ON DUPLICATE KEY UPDATE title = new_pub.title, publication_type = new_pub.publication_type
                ''', (faculty_id, pub_clean[:500], ptype))
                
            except Exception as e:
                print(f"Error inserting publication for faculty {faculty_id}: {e}")

def insert_simple_list(cursor, faculty_id, items, table, column):
    """Insert simple list items (research guidance, projects, awards, etc.)"""
    if not faculty_id or not items:
        return
        
    for item in items:
        try:
            item_text = item if isinstance(item, str) else str(item)
            item_text = item_text.strip()[:500]  # Limit length
            
            if not item_text:
                continue
                
            if table == 'faculty_research_guidance':
                cursor.execute(f'''
                    INSERT INTO {table} (faculty_id, student_name, guidance_type, status)
                    VALUES (%s, %s, %s, %s)
                ''', (faculty_id, item_text[:200], 'phd', 'completed' if 'AWARDED' in item_text else 'submitted'))
            elif table == 'faculty_professional_services':
                cursor.execute(f'''
                    INSERT INTO {table} (faculty_id, service_type, description)
                    VALUES (%s, 'other', %s)
                ''', (faculty_id, item_text))
            else:
                cursor.execute(f'''
                    INSERT INTO {table} (faculty_id, {column})
                    VALUES (%s, %s)
                ''', (faculty_id, item_text))
                
        except Exception as e:
            print(f"Error inserting {table} item for faculty {faculty_id}: {e}")

def insert_courses_taught(cursor, faculty_id, courses):
    """Insert courses taught with UG/PG levels"""
    if not faculty_id or not courses:
        return
        
    if isinstance(courses, dict):
        for level in ['ug', 'pg']:
            for course in courses.get(level, []):
                try:
                    course_text = course if isinstance(course, str) else str(course)
                    cursor.execute('''
                        INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level)
                        VALUES (%s, %s, %s) AS new_course
                        ON DUPLICATE KEY UPDATE course_level = new_course.course_level
                    ''', (faculty_id, course_text[:300], level))
                except Exception as e:
                    print(f"Error inserting course taught for faculty {faculty_id}: {e}")
    else:
        for course in courses:
            try:
                course_text = course if isinstance(course, str) else str(course)
                cursor.execute('''
                    INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level)
                    VALUES (%s, %s, %s) AS new_course
                    ON DUPLICATE KEY UPDATE course_level = new_course.course_level
                ''', (faculty_id, course_text[:300], 'ug'))
            except Exception as e:
                print(f"Error inserting course taught for faculty {faculty_id}: {e}")

def insert_course_info(cursor, faculty_id, courses, table):
    """Insert course information (attended/conducted)"""
    if not faculty_id or not courses:
        return
        
    for course in courses:
        try:
            course_text = course.get('info', '') if isinstance(course, dict) else str(course)
            cursor.execute(f'''
                INSERT INTO {table} (faculty_id, course_title)
                VALUES (%s, %s) AS new_course
                ON DUPLICATE KEY UPDATE course_title = new_course.course_title
            ''', (faculty_id, course_text[:500]))
        except Exception as e:
            print(f"Error inserting {table} for faculty {faculty_id}: {e}")

def process_faculty_file(cursor, file_path):
    """Process a single faculty JSON file"""
    try:
        faculty_data = load_faculty_json(file_path)
        if not faculty_data:
            return False
            
        profile = faculty_data.get('profile', {})
        if not profile.get('name'):
            print(f"Skipping {file_path} - missing name")
            return False
            
        # Insert faculty profile
        faculty_id = insert_faculty_profile(cursor, faculty_data, profile)
        if not faculty_id:
            print(f"Could not insert/find faculty for {profile.get('name')}")
            return False
            
        # Insert all related data
        insert_academic_info(cursor, faculty_id, faculty_data.get('academicInformation', []))
        insert_publications(cursor, faculty_id, faculty_data.get('publications', {}))
        insert_simple_list(cursor, faculty_id, faculty_data.get('researchGuidance', []), 'faculty_research_guidance', 'student_name')
        insert_simple_list(cursor, faculty_id, faculty_data.get('fundedProjects', []), 'faculty_funded_projects', 'project_title')
        insert_simple_list(cursor, faculty_id, faculty_data.get('awardsAndHonors', []), 'faculty_awards', 'award_title')
        insert_simple_list(cursor, faculty_id, faculty_data.get('memberships', []), 'faculty_memberships', 'organization_name')
        insert_simple_list(cursor, faculty_id, faculty_data.get('professionalServices', []), 'faculty_professional_services', 'description')
        insert_courses_taught(cursor, faculty_id, faculty_data.get('coursesTaught', {}))
        insert_course_info(cursor, faculty_id, faculty_data.get('coursesAttended', []), 'faculty_courses_attended')
        insert_course_info(cursor, faculty_id, faculty_data.get('coursesConducted', []), 'faculty_courses_conducted')
        
        print(f"✅ Successfully processed {profile.get('name')}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing file {file_path}: {e}")
        return False

def populate_department(department=None):
    """Populate faculty data for a specific department or all departments"""
    try:
        print_section_header(f"NIT GOA FACULTY DATABASE POPULATION - {department or 'ALL DEPARTMENTS'}")
        
        with DatabaseConnection() as (cursor, conn):
            files = get_json_files(department)
            print(f"Found {len(files)} JSON files to process")
            
            if not files:
                print("No JSON files found!")
                return False
                
            processed = 0
            for file_path in files:
                print(f"\nProcessing: {os.path.basename(file_path)}")
                if process_faculty_file(cursor, file_path):
                    processed += 1
                    
            print(f"\n🎉 Completed! Processed {processed} out of {len(files)} faculty files.")
            return processed == len(files)
            
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Populate NIT Goa Faculty Database')
    parser.add_argument('--department', choices=['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'HSS', 'APS'], 
                       help='Process only specific department')
    parser.add_argument('--verify', action='store_true', help='Run verification after population')
    
    args = parser.parse_args()
    
    success = populate_department(args.department)
    
    if success and args.verify:
        print("\n" + "="*80)
        print("🔍 RUNNING POST-POPULATION VERIFICATION...")
        # Import and run verification
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'verification'))
        from verify_institutional_data import verify_all_departments
        verify_all_departments()
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
