"""
Database Configuration and Shared Utilities for NIT Goa Faculty Database Scripts

This module contains shared configuration, database connection utilities, and common functions
used across all faculty database management scripts.
"""

import os
import json
import mysql.connector
from glob import glob
import traceback

# Database Connection Configuration
DB_CONFIG = {
    'user': 'root',
    'password': 'Mrutyu@2026',
    'host': 'localhost',
    'database': 'nitgoa_db',
    'raise_on_warnings': True
}

# Data Directory Configuration
DATA_DIR = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data'

# Department Mappings
DEPARTMENT_MAPPINGS = {
    'Computer Science': 'CSE',
    'Electronics & Communication': 'ECE', 
    'Electrical & Electronics': 'EEE',
    'Mechanical': 'MCE',
    'Civil': 'CVE',
    'Humanities': 'HSS',
    'Applied Sciences': 'APS'
}

# Department JSON Directory Mappings
DEPARTMENT_JSON_DIRS = {
    'CSE': 'cse_json',
    'ECE': 'ece_json', 
    'EEE': 'eee_json',
    'MCE': 'mce_json',
    'CVE': 'cve_json',
    'HSS': 'hss_json',
    'APS': 'aps_json'
}

# Data Verification Sections
VERIFICATION_SECTIONS = [
    ('publications', ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'], 'faculty_publications'),
    ('coursesTaught', None, 'faculty_courses_taught'),
    ('academicInformation', None, 'faculty_academic_info'),
    ('researchGuidance', None, 'faculty_research_guidance'),
    ('fundedProjects', None, 'faculty_funded_projects'),
    ('awardsAndHonors', None, 'faculty_awards'),
    ('memberships', None, 'faculty_memberships'),
    ('professionalServices', None, 'faculty_professional_services'),
    ('coursesAttended', None, 'faculty_courses_attended'),
    ('coursesConducted', None, 'faculty_courses_conducted')
]

class DatabaseConnection:
    """Database connection context manager"""
    
    def __init__(self, config=None):
        self.config = config or DB_CONFIG
        self.connection = None
        self.cursor = None
    
    def __enter__(self):
        self.connection = mysql.connector.connect(**self.config)
        self.cursor = self.connection.cursor()
        return self.cursor, self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            if exc_type is None:
                self.connection.commit()
            else:
                self.connection.rollback()
            self.connection.close()

def get_json_files(department=None):
    """Get JSON files for a specific department or all departments"""
    if department:
        dept_dir = DEPARTMENT_JSON_DIRS.get(department.upper())
        if dept_dir:
            return glob(os.path.join(DATA_DIR, dept_dir, '*.json'))
        return []
    else:
        return glob(os.path.join(DATA_DIR, '*_json', '*.json'))

def get_department_code(dept_name):
    """Map department name to code"""
    for key, code in DEPARTMENT_MAPPINGS.items():
        if key in dept_name:
            return code
    return 'CSE'  # default

def load_faculty_json(file_path):
    """Load and validate faculty JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def get_faculty_by_name(cursor, full_name):
    """Get faculty ID by full name"""
    cursor.execute('SELECT id FROM faculty_profiles WHERE full_name = %s', (full_name,))
    result = cursor.fetchone()
    return result[0] if result else None

def count_json_data(faculty_data, json_key, sub_keys=None):
    """Count items in JSON data section"""
    if json_key == 'publications':
        count = 0
        pub_data = faculty_data.get(json_key, {})
        for sub_key in sub_keys:
            count += len(pub_data.get(sub_key, []))
        return count
    elif json_key == 'coursesTaught':
        courses_data = faculty_data.get(json_key, {})
        if isinstance(courses_data, dict):
            return len(courses_data.get('ug', [])) + len(courses_data.get('pg', []))
        else:
            return len(courses_data) if courses_data else 0
    else:
        data = faculty_data.get(json_key, [])
        return len(data) if data else 0

def print_section_header(title, width=80):
    """Print formatted section header"""
    print("\n" + "=" * width)
    print(f"🔍 {title}")
    print("=" * width)

def print_status(message, status="info"):
    """Print formatted status message"""
    icons = {"success": "✅", "error": "❌", "warning": "⚠️", "info": "ℹ️"}
    icon = icons.get(status, "•")
    print(f"{icon} {message}")

def print_summary(department, perfect_count, total_count):
    """Print department summary"""
    percentage = (perfect_count / total_count * 100) if total_count > 0 else 0
    status = "🟢 PERFECT" if percentage == 100.0 else f"🟡 {percentage:.1f}%"
    print(f"\n📊 {department} Summary: {perfect_count}/{total_count} perfect ({percentage:.1f}%) - {status}")
