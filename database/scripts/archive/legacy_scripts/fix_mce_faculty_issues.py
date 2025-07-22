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

# PROTECTED MCE FACULTY IDs - NEVER MODIFY THESE
PROTECTED_MCE_FACULTY_IDS = [38, 40, 44, 36]  # Gaurang, Pravin, Samar, Santhi

# ONLY these MCE faculty IDs can be modified
ALLOWED_MCE_FACULTY_IDS = [37, 41, 39, 35]  # Abhijit, Animesh, Darius, Prasenjit

def fix_abhijit_sarkar_academic(cursor):
    """Fix Dr. Abhijit Sarkar (ID: 37) - Missing academic info"""
    faculty_id = 37
    if faculty_id in PROTECTED_MCE_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Abhijit Sarkar
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json/Abhijit_Sarkar.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Abhijit Sarkar - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
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
                
                if degree or institute:  # At least one field should have data
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted academic record: {degree} from {institute}")
                    break  # Only insert missing records
            return True
            
    except Exception as e:
        print(f"Error fixing Abhijit Sarkar academic info: {e}")
        return False

def fix_animesh_chatterjee_academic(cursor):
    """Fix Prof. Animesh Chatterjee (ID: 41) - Missing academic info"""
    faculty_id = 41
    if faculty_id in PROTECTED_MCE_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Animesh Chatterjee
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json/Animesh_Chatterjee.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Animesh Chatterjee - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
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
                
                if degree or institute:  # At least one field should have data
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted academic record: {degree} from {institute} ({year})")
            return True
            
    except Exception as e:
        print(f"Error fixing Animesh Chatterjee academic info: {e}")
        return False

def fix_darius_designation(cursor):
    """Fix Dr. Darius Diogo Barreto (ID: 39) - Designation case mismatch"""
    faculty_id = 39
    if faculty_id in PROTECTED_MCE_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Update the designation in database to match JSON (lowercase 'contract')
        cursor.execute('''
            UPDATE faculty_profiles 
            SET designation = 'Faculty on contract'
            WHERE id = %s
        ''', (faculty_id,))
        print("Fixed Darius designation to match JSON format")
        return True
    except Exception as e:
        print(f"Error fixing Darius designation: {e}")
        return False

def fix_prasenjit_dey_academic(cursor):
    """Fix Dr. PRASENJIT DEY (ID: 35) - Missing academic info"""
    faculty_id = 35
    if faculty_id in PROTECTED_MCE_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Prasenjit Dey
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json/PRASENJIT_DEY.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Prasenjit Dey - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
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
                
                if degree or institute:  # At least one field should have data
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted academic record: {degree} from {institute} ({year})")
            return True
            
    except Exception as e:
        print(f"Error fixing Prasenjit Dey academic info: {e}")
        return False

def main():
    try:
        print("🔧 FIXING MCE FACULTY ISSUES (4 faculty only)")
        print("🔒 PROTECTED MCE FACULTY IDs:", PROTECTED_MCE_FACULTY_IDS)
        print("✅ ALLOWED TO MODIFY:", ALLOWED_MCE_FACULTY_IDS)
        print()
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        fixes_applied = 0
        
        # Fix Abhijit Sarkar (ID: 37) - Missing academic info
        print("1. Fixing Abhijit Sarkar academic info...")
        if fix_abhijit_sarkar_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Animesh Chatterjee (ID: 41) - Missing academic info
        print("2. Fixing Animesh Chatterjee academic info...")
        if fix_animesh_chatterjee_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Darius (ID: 39) - Designation mismatch
        print("3. Fixing Darius designation...")
        if fix_darius_designation(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Prasenjit Dey (ID: 35) - Missing academic info
        print("4. Fixing Prasenjit Dey academic info...")
        if fix_prasenjit_dey_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        print(f"\n✅ Applied {fixes_applied}/4 MCE fixes successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
