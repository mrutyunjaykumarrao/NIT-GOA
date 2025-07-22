import os
import json
import mysql.connector
import traceback

# Database connection config
DB_CONFIG = {
    'user': 'root',
    'password': 'Mrutyu@2026',
    'host': 'localhost',
    'database': 'nitgoa_db',
    'raise_on_warnings': True
}

def fix_lasitha_academic():
    """Fix Dr. Lasitha P. (ID: 62) - Missing 1 academic record"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🔧 FIXING DR. LASITHA P. ACADEMIC INFO")
        print("=" * 50)
        
        faculty_id = 62
        
        # Read the JSON file for Lasitha P.
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/aps_json/Lasitha.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Dr. Lasitha P. - DB: {db_count}, JSON: {len(academic_info)}")
        
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
            
            conn.commit()
            print("✅ Dr. Lasitha P. academic info fixed successfully!")
            return True
        else:
            print("✅ Dr. Lasitha P. academic info already correct!")
            return True
            
    except Exception as e:
        print(f"❌ Error fixing Dr. Lasitha P. academic info: {e}")
        traceback.print_exc()
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    fix_lasitha_academic()
