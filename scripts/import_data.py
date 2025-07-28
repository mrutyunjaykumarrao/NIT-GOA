#!/usr/bin/env python3
"""
Data Import Script for NIT GOA Enhanced Database (Python Version)
Imports departments and courses from JSON files using pandas and mysql-connector
"""

import json
import mysql.connector
import pandas as pd
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "server" / ".env")

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'updated_nitgoa'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'charset': 'utf8mb4'
}

# File paths
BASE_DIR = Path(__file__).parent.parent
DEPARTMENTS_FILE = BASE_DIR / "RefrenceMaterial/collaborators/MJ 2/updated_database/departments.json"
COURSES_FILE = BASE_DIR / "RefrenceMaterial/collaborators/MJ 2/updated_database/courses.json"

def connect_database():
    """Connect to MySQL database"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        print(f"✅ Database connected successfully!")
        print(f"📊 Connected to database: {DB_CONFIG['database']}")
        return connection
    except mysql.connector.Error as error:
        print(f"❌ Database connection failed: {error}")
        sys.exit(1)

def import_departments(connection):
    """Import departments from JSON file"""
    print("\n🏢 Importing Departments...")
    
    try:
        # Read departments JSON
        with open(DEPARTMENTS_FILE, 'r') as f:
            departments_data = json.load(f)
        
        cursor = connection.cursor()
        added_count = 0
        updated_count = 0
        
        for dept_name, dept_code in departments_data.items():
            # Check if department exists
            cursor.execute(
                "SELECT department_id FROM departments WHERE department_code = %s OR department_name = %s",
                (dept_code, dept_name)
            )
            existing = cursor.fetchone()
            
            if existing:
                # Update existing department
                cursor.execute("""
                    UPDATE departments SET 
                    department_name = %s, 
                    department_code = %s, 
                    is_active = TRUE, 
                    updated_at = CURRENT_TIMESTAMP 
                    WHERE department_id = %s
                """, (dept_name, dept_code, existing[0]))
                updated_count += 1
                print(f"   ⬆️  Updated: {dept_code} - {dept_name}")
            else:
                # Insert new department
                cursor.execute("""
                    INSERT INTO departments (department_name, department_code, description, is_active, display_order) 
                    VALUES (%s, %s, %s, TRUE, %s)
                """, (dept_name, dept_code, dept_name, added_count + 1))
                added_count += 1
                print(f"   ➕ Added: {dept_code} - {dept_name}")
        
        connection.commit()
        cursor.close()
        
        print(f"✅ Departments import completed! Added: {added_count}, Updated: {updated_count}")
        return {'added': added_count, 'updated': updated_count}
        
    except Exception as error:
        print(f"❌ Error importing departments: {error}")
        raise

def extract_department_code(course_code):
    """Extract department code from course code"""
    match = re.match(r'^([A-Z]+)', course_code)
    
    # Map common prefixes to department codes
    mapping = {
        'CS': 'CSE',
        'EC': 'ECE', 
        'EE': 'EEE',
        'ME': 'MCE',
        'CV': 'CVE',
        'MA': 'APS',  # Mathematics -> Applied Sciences
        'PH': 'APS',  # Physics -> Applied Sciences
        'CY': 'APS',  # Chemistry -> Applied Sciences
        'HU': 'HSS',  # Humanities
        'HS': 'HSS',  # Humanities and Social Sciences
        'IE': 'MCE',  # Industrial Engineering -> Mechanical
        'ES': 'CVE',  # Environmental Studies -> Civil
        'PE': 'HSS',  # Physical Education -> HSS
        'IKS': 'HSS', # Indian Knowledge System -> HSS
        'IKXXX': 'HSS'
    }
    
    if match:
        prefix = match.group(1)
        return mapping.get(prefix, prefix)
    
    return 'CSE'  # Default fallback

def import_courses(connection):
    """Import courses from JSON file using pandas for better data handling"""
    print("\n📚 Importing Courses...")
    
    try:
        # Read courses JSON
        with open(COURSES_FILE, 'r') as f:
            courses_data = json.load(f)
        
        cursor = connection.cursor()
        
        # Get department mappings
        cursor.execute("SELECT department_id, department_code FROM departments")
        dept_mapping = {code: dept_id for dept_id, code in cursor.fetchall()}
        
        added_count = 0
        updated_count = 0
        skipped_count = 0
        
        # Process undergraduate courses
        if 'undergraduate_courses' in courses_data:
            print("   📖 Processing undergraduate courses...")
            ug_courses = []
            
            for course_code, course_name in courses_data['undergraduate_courses'].items():
                dept_code = extract_department_code(course_code)
                dept_id = dept_mapping.get(dept_code)
                
                ug_courses.append({
                    'course_code': course_code,
                    'course_name': course_name,
                    'course_level': 'Undergraduate',
                    'department_id': dept_id,
                    'dept_code': dept_code
                })
            
            # Convert to DataFrame for easier processing
            ug_df = pd.DataFrame(ug_courses)
            
            for _, course in ug_df.iterrows():
                # Check if course exists
                cursor.execute("SELECT course_id FROM courses WHERE course_code = %s", (course['course_code'],))
                existing = cursor.fetchone()
                
                if existing:
                    # Update existing
                    cursor.execute("""
                        UPDATE courses SET 
                        course_name = %s, 
                        department_id = %s, 
                        course_level = 'Undergraduate',
                        is_active = TRUE, 
                        updated_at = CURRENT_TIMESTAMP 
                        WHERE course_id = %s
                    """, (course['course_name'], course['department_id'], existing[0]))
                    updated_count += 1
                else:
                    # Insert new
                    cursor.execute("""
                        INSERT INTO courses (course_code, course_name, course_level, department_id, is_active) 
                        VALUES (%s, %s, 'Undergraduate', %s, TRUE)
                    """, (course['course_code'], course['course_name'], course['department_id']))
                    added_count += 1
                
                if not course['department_id']:
                    print(f"   ⚠️  No department found for course: {course['course_code']} (dept: {course['dept_code']})")
                    skipped_count += 1
        
        # Process postgraduate courses
        if 'postgraduate_courses' in courses_data:
            print("   🎓 Processing postgraduate courses...")
            pg_courses = []
            
            for course_code, course_name in courses_data['postgraduate_courses'].items():
                dept_code = extract_department_code(course_code)
                dept_id = dept_mapping.get(dept_code)
                
                pg_courses.append({
                    'course_code': course_code,
                    'course_name': course_name,
                    'course_level': 'Postgraduate',
                    'department_id': dept_id,
                    'dept_code': dept_code
                })
            
            # Convert to DataFrame
            pg_df = pd.DataFrame(pg_courses)
            
            for _, course in pg_df.iterrows():
                # Check if course exists
                cursor.execute("SELECT course_id FROM courses WHERE course_code = %s", (course['course_code'],))
                existing = cursor.fetchone()
                
                if existing:
                    # Update existing
                    cursor.execute("""
                        UPDATE courses SET 
                        course_name = %s, 
                        department_id = %s, 
                        course_level = 'Postgraduate',
                        is_active = TRUE, 
                        updated_at = CURRENT_TIMESTAMP 
                        WHERE course_id = %s
                    """, (course['course_name'], course['department_id'], existing[0]))
                    updated_count += 1
                else:
                    # Insert new
                    cursor.execute("""
                        INSERT INTO courses (course_code, course_name, course_level, department_id, is_active) 
                        VALUES (%s, %s, 'Postgraduate', %s, TRUE)
                    """, (course['course_code'], course['course_name'], course['department_id']))
                    added_count += 1
        
        connection.commit()
        cursor.close()
        
        print(f"✅ Courses import completed! Added: {added_count}, Updated: {updated_count}, Warnings: {skipped_count}")
        return {'added': added_count, 'updated': updated_count, 'skipped': skipped_count}
        
    except Exception as error:
        print(f"❌ Error importing courses: {error}")
        raise

def display_summary(connection):
    """Display database summary using pandas for better formatting"""
    print("\n📊 Database Summary:")
    
    try:
        # Count departments
        dept_count = pd.read_sql("SELECT COUNT(*) as count FROM departments WHERE is_active = TRUE", connection)
        print(f"   🏢 Active Departments: {dept_count['count'].iloc[0]}")
        
        # Count courses by level
        ug_count = pd.read_sql("SELECT COUNT(*) as count FROM courses WHERE course_level = 'Undergraduate' AND is_active = TRUE", connection)
        pg_count = pd.read_sql("SELECT COUNT(*) as count FROM courses WHERE course_level = 'Postgraduate' AND is_active = TRUE", connection)
        
        print(f"   📚 Undergraduate Courses: {ug_count['count'].iloc[0]}")
        print(f"   🎓 Postgraduate Courses: {pg_count['count'].iloc[0]}")
        
        # Department breakdown
        breakdown_query = """
            SELECT d.department_code, d.department_name, COUNT(c.course_id) as course_count
            FROM departments d 
            LEFT JOIN courses c ON d.department_id = c.department_id AND c.is_active = TRUE
            WHERE d.is_active = TRUE
            GROUP BY d.department_id, d.department_code, d.department_name
            ORDER BY d.department_code
        """
        
        breakdown_df = pd.read_sql(breakdown_query, connection)
        
        print('\n   📋 Courses per Department:')
        for _, dept in breakdown_df.iterrows():
            print(f"      {dept['department_code']}: {dept['course_count']} courses")
        
    except Exception as error:
        print(f"❌ Error generating summary: {error}")

def main():
    """Main function"""
    print('🔧 NIT GOA Data Import Utility (Python Version)')
    print('==============================================\n')
    
    connection = None
    
    try:
        # Connect to database
        connection = connect_database()
        
        # Import departments
        dept_results = import_departments(connection)
        
        # Import courses
        course_results = import_courses(connection)
        
        # Display summary
        display_summary(connection)
        
        print('\n🎉 Data import completed successfully!')
        print(f'\n📈 Final Results:')
        print(f'   Departments: {dept_results["added"]} added, {dept_results["updated"]} updated')
        print(f'   Courses: {course_results["added"]} added, {course_results["updated"]} updated, {course_results["skipped"]} warnings')
        
    except Exception as error:
        print(f'\n❌ Import failed: {error}')
        sys.exit(1)
    finally:
        if connection and connection.is_connected():
            connection.close()
            print('\n🔌 Database connection closed.')

if __name__ == "__main__":
    main()
