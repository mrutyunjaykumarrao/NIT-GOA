#!/usr/bin/env python3
"""
Faculty Data Migration Script - Simplified Version
This script reads faculty data from JSON files and populates the database
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

def execute_schema_file(connection, schema_file):
    """Execute the schema file to create/update database structure"""
    try:
        with open(schema_file, 'r', encoding='utf-8') as file:
            schema_content = file.read()
        
        cursor = connection.cursor()
        
        # Split the content by semicolon and execute each statement
        statements = [stmt.strip() for stmt in schema_content.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement:
                try:
                    cursor.execute(statement)
                except mysql.connector.Error as err:
                    if "already exists" not in str(err).lower():
                        print(f"Warning: Error executing statement: {err}")
                    # Continue with other statements
        
        connection.commit()
        cursor.close()
        print("Schema updated successfully!")
        
    except Exception as e:
        print(f"Error executing schema file: {e}")
        sys.exit(1)

def clean_text(text):
    """Clean and normalize text data"""
    if not text:
        return None
    if isinstance(text, list):
        text = ', '.join(str(item) for item in text)
    return str(text).strip()

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

def parse_publication(pub_text):
    """Parse publication text to extract details"""
    if not pub_text:
        return {}
    
    # Extract year and month from end of publication
    year_month_pattern = r'(\w+)\s+(\d{4})\s*$'
    match = re.search(year_month_pattern, pub_text)
    
    year = None
    month = None
    if match:
        month = match.group(1)
        year = match.group(2)
    
    # Try to extract impact factor or indexing info
    impact_pattern = r'\(IF[:\s]*([0-9.]+)\)'
    impact_match = re.search(impact_pattern, pub_text)
    impact_factor = impact_match.group(1) if impact_match else None
    
    # Extract indexing info like SCI, SCIE, etc.
    indexing_pattern = r'\b(SCI|SCIE|ESCI|Scopus)\b.*?\([^)]*\)'
    indexing_match = re.search(indexing_pattern, pub_text)
    indexing_info = indexing_match.group(0) if indexing_match else None
    
    return {
        'year': year,
        'month': month,
        'impact_factor': impact_factor,
        'indexing_info': indexing_info,
        'full_citation': pub_text
    }

def insert_faculty_profile(cursor, faculty_data, department):
    """Insert faculty profile data"""
    profile = faculty_data.get('profile', {})
    personal_info = faculty_data.get('personalInformation', {})
    contact_info = faculty_data.get('contactInformation', {})
    
    # Extract name parts
    full_name = profile.get('name') or personal_info.get('name', '')
    name_parts = full_name.replace('Dr. ', '').replace('Prof. ', '').strip().split()
    first_name = name_parts[0] if name_parts else ''
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
        profile.get('email') or contact_info.get('email'),
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
        personal_info.get('url'),
        is_hod,
        1
    )
    
    cursor.execute(faculty_query, faculty_values)
    return cursor.lastrowid

def insert_academic_info(cursor, faculty_id, academic_data):
    """Insert academic information"""
    if not academic_data:
        return
    
    for i, edu in enumerate(academic_data):
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

def insert_courses_taught(cursor, faculty_id, courses_data):
    """Insert courses taught"""
    if not courses_data:
        return
    
    for level, courses in courses_data.items():
        if courses:
            for course in courses:
                query = """
                INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level)
                VALUES (%s, %s, %s)
                """
                cursor.execute(query, (faculty_id, course, level))

def insert_publications(cursor, faculty_id, publications_data):
    """Insert publications"""
    if not publications_data:
        return
    
    for pub_type, pubs in publications_data.items():
        if pubs:
            for pub in pubs:
                pub_details = parse_publication(pub)
                
                query = """
                INSERT INTO faculty_publications (
                    faculty_id, publication_type, full_citation, publication_year,
                    publication_month, impact_factor, indexing_info
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                values = (
                    faculty_id,
                    'proceedings' if pub_type == 'proceedings' else 'journal',
                    pub,
                    pub_details.get('year'),
                    pub_details.get('month'),
                    pub_details.get('impact_factor'),
                    pub_details.get('indexing_info')
                )
                cursor.execute(query, values)

def insert_research_guidance(cursor, faculty_id, guidance_data):
    """Insert research guidance information"""
    if not guidance_data:
        return
    
    for guidance in guidance_data:
        # Parse guidance text to extract student name and topic
        guidance_text = str(guidance)
        
        # Try to extract student name (usually starts with Mr./Ms./Dr.)
        name_match = re.search(r'(Mr\.|Ms\.|Dr\.)\s*([^,]+)', guidance_text)
        student_name = name_match.group(2).strip() if name_match else guidance_text[:100]
        
        # Extract topic (usually in quotes or after "working on")
        topic_match = re.search(r'working on\s*["\']?([^"\']+)["\']?', guidance_text, re.IGNORECASE)
        topic = topic_match.group(1).strip() if topic_match else None
        
        # Determine status
        status = 'ongoing' if 'ongoing' in guidance_text.lower() else 'completed'
        
        query = """
        INSERT INTO faculty_research_guidance (
            faculty_id, student_name, research_topic, status
        ) VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (faculty_id, student_name, topic, status))

def insert_courses_attended(cursor, faculty_id, courses_data):
    """Insert courses attended"""
    if not courses_data:
        return
    
    for course in courses_data:
        query = """
        INSERT INTO faculty_courses_attended (
            faculty_id, course_title, month, year, description
        ) VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            faculty_id,
            course.get('info', ''),
            course.get('month'),
            str(course.get('year', '')),
            course.get('info', '')
        )
        cursor.execute(query, values)

def insert_courses_conducted(cursor, faculty_id, courses_data):
    """Insert courses conducted"""
    if not courses_data:
        return
    
    for course in courses_data:
        query = """
        INSERT INTO faculty_courses_conducted (
            faculty_id, course_title, month, year, description
        ) VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            faculty_id,
            course.get('info', ''),
            course.get('month'),
            str(course.get('year', '')),
            course.get('info', '')
        )
        cursor.execute(query, values)

def process_faculty_file(cursor, filepath):
    """Process a single faculty JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            faculty_data = json.load(file)
        
        department = extract_department_from_filename(filepath)
        
        # Insert faculty profile
        faculty_id = insert_faculty_profile(cursor, faculty_data, department)
        print(f"Inserted faculty: {faculty_data.get('profile', {}).get('name', 'Unknown')} (ID: {faculty_id})")
        
        # Insert related data
        insert_academic_info(cursor, faculty_id, faculty_data.get('academicInformation', []))
        insert_courses_taught(cursor, faculty_id, faculty_data.get('coursesTaught', {}))
        insert_publications(cursor, faculty_id, faculty_data.get('publications', {}))
        insert_research_guidance(cursor, faculty_id, faculty_data.get('researchGuidance', []))
        insert_courses_attended(cursor, faculty_id, faculty_data.get('coursesAttended', []))
        insert_courses_conducted(cursor, faculty_id, faculty_data.get('coursesConducted', []))
        
        return True
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to run the migration"""
    print("Starting Faculty Data Migration...")
    print("Using database credentials from server configuration...")
    
    # Paths
    base_dir = Path(__file__).parent
    schema_file = base_dir / 'schemas' / 'updated_schema.sql'
    data_dir = base_dir / '..' / 'client' / 'src' / 'Views' / 'People-Section' / 'Faculty' / 'FacultyDetails' / 'data'
    
    # Connect to database
    connection = connect_to_database()
    
    try:
        # Update schema
        print("Updating database schema...")
        execute_schema_file(connection, schema_file)
        
        cursor = connection.cursor()
        
        # Process all faculty files
        departments = ['aps_json', 'cse_json', 'cve_json', 'ece_json', 'eee_json', 'hss_json', 'mce_json']
        
        total_processed = 0
        total_success = 0
        
        for dept_dir in departments:
            dept_path = data_dir / dept_dir
            if dept_path.exists():
                print(f"\\nProcessing {dept_dir}...")
                
                for json_file in dept_path.glob('*.json'):
                    total_processed += 1
                    if process_faculty_file(cursor, json_file):
                        total_success += 1
                    
                    # Commit after each faculty member
                    connection.commit()
        
        print(f"\\nMigration completed!")
        print(f"Total files processed: {total_processed}")
        print(f"Successfully migrated: {total_success}")
        print(f"Failed: {total_processed - total_success}")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        connection.rollback()
    
    finally:
        connection.close()

if __name__ == "__main__":
    main()
