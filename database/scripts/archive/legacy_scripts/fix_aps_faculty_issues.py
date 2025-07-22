import os
import json
import mysql.connector
from glob import glob
import traceback

# Database connection config
DB_CONFIG = {
    'user': 'root',
    'password': 'Mrutyu@2026',
    'host': 'localhost',
    'database': 'nitgoa_db',
    'raise_on_warnings': True
}

# PROTECTED APS FACULTY IDs - NEVER MODIFY THESE
PROTECTED_APS_FACULTY_IDS = [55, 58, 59, 60]  # Shangerganesh, Ragoju Ravi, Ravi Prasad, Suman Gandi

# ONLY these APS faculty IDs can be modified
ALLOWED_APS_FACULTY_IDS = [56, 57]  # Saidi Reddy Parne, Velavan Kathirvelu

def fix_saidi_reddy_academic(cursor):
    """Fix Dr. Saidi Reddy Parne (ID: 56) - Missing 1 academic record"""
    faculty_id = 56
    if faculty_id in PROTECTED_APS_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Saidi Reddy Parne
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/aps_json/Saidi_Reddy_Parne.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Saidi Reddy Parne - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
            # Get existing records to avoid duplicates
            cursor.execute('SELECT degree, institute, year FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
            existing_records = set()
            for row in cursor.fetchall():
                existing_records.add((row[0], row[1], row[2]))
            
            for edu in academic_info:
                if not edu:
                    continue
                    
                degree = edu.get('degree', '') or ''
                institute = edu.get('institute', '') or ''
                year = edu.get('year', '') or ''
                subject = edu.get('subject', '') or ''
                
                # Strip only if not None
                degree = degree.strip() if degree else ''
                institute = institute.strip() if institute else ''
                year = year.strip() if year else ''
                subject = subject.strip() if subject else ''
                
                # Check if this record already exists
                record_key = (degree, institute, year)
                if record_key not in existing_records and (degree or institute):
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted academic record: {degree} from {institute} ({year})")
                    existing_records.add(record_key)
            return True
            
    except Exception as e:
        print(f"Error fixing Saidi Reddy Parne academic info: {e}")
        return False

def fix_velavan_academic(cursor):
    """Fix Dr. Velavan Kathirvelu (ID: 57) - Missing all 5 academic records"""
    faculty_id = 57
    if faculty_id in PROTECTED_APS_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Velavan Kathirvelu
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/aps_json/Velavan_Kathirvelu.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Velavan Kathirvelu - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
            # Get existing records to avoid duplicates
            cursor.execute('SELECT degree, institute, year FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
            existing_records = set()
            for row in cursor.fetchall():
                existing_records.add((row[0], row[1], row[2]))
            
            for edu in academic_info:
                if not edu:
                    continue
                    
                degree = edu.get('degree', '') or ''
                institute = edu.get('institute', '') or ''
                year = edu.get('year', '') or ''
                subject = edu.get('subject', '') or ''
                
                # Strip only if not None
                degree = degree.strip() if degree else ''
                institute = institute.strip() if institute else ''
                year = year.strip() if year else ''
                subject = subject.strip() if subject else ''
                
                # Check if this record already exists
                record_key = (degree, institute, year)
                if record_key not in existing_records and (degree or institute):
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted academic record: {degree} from {institute} ({year})")
                    existing_records.add(record_key)
            return True
            
    except Exception as e:
        print(f"Error fixing Velavan Kathirvelu academic info: {e}")
        return False

def main():
    try:
        print("🔧 FIXING APS FACULTY ISSUES")
        print("🔒 PROTECTED APS FACULTY IDs:", PROTECTED_APS_FACULTY_IDS)
        print("✅ ALLOWED TO MODIFY:", ALLOWED_APS_FACULTY_IDS)
        print()
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        fixes_applied = 0
        
        # Fix Dr. Saidi Reddy Parne (ID: 56) - Missing 1 academic record
        print("1. Fixing Dr. Saidi Reddy Parne academic info...")
        if fix_saidi_reddy_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Dr. Velavan Kathirvelu (ID: 57) - Missing all 5 academic records
        print("\n2. Fixing Dr. Velavan Kathirvelu academic info...")
        if fix_velavan_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        print(f"\n✅ Applied {fixes_applied}/2 APS fixes successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
