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

# PROTECTED FACULTY IDs - NEVER MODIFY THESE
PROTECTED_FACULTY_IDS = [10, 2, 76, 15, 24, 20, 23, 22, 16, 21, 19, 18, 14, 13]

# ONLY these faculty IDs can be modified
ALLOWED_FACULTY_IDS = [7, 4, 1, 17]  # Modi Chirag, S. Mini, Veena, Trilochan

def fix_modi_chirag_publication(cursor):
    """Fix Dr. Modi Chirag Navinchandra (ID: 7) - Missing 1 publication"""
    faculty_id = 7
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Modi Chirag
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Modi_Chirag_Navinchandra.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        publications = faculty_data.get('publications', {})
        
        # Get current publications count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        # Calculate expected count from JSON
        json_count = sum(len(publications.get(pub_type, [])) for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'])
        
        print(f"Modi Chirag - DB: {db_count}, JSON: {json_count}")
        
        if db_count < json_count:
            # Find and insert missing publications
            existing_pubs = set()
            cursor.execute('SELECT title FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
            for row in cursor.fetchall():
                existing_pubs.add(row[0].strip())
            
            for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
                for pub in publications.get(pub_type, []):
                    pub_clean = pub.strip()
                    if pub_clean and pub_clean not in existing_pubs:
                        ptype = 'journal' if pub_type == 'journal' else \
                                'conference' if pub_type == 'conference' else \
                                'proceedings' if pub_type == 'proceedings' else \
                                'chapter' if pub_type == 'bookChapters' else \
                                'book' if pub_type == 'booksAuthored' else 'other'
                        
                        cursor.execute('''
                            INSERT INTO faculty_publications (faculty_id, title, publication_type)
                            VALUES (%s, %s, %s)
                        ''', (faculty_id, pub_clean[:500], ptype))
                        print(f"Inserted missing publication: {pub_clean[:50]}...")
                        break  # Only insert one missing publication
            return True
            
    except Exception as e:
        print(f"Error fixing Modi Chirag publications: {e}")
        return False

def fix_s_mini_name(cursor):
    """Fix Dr. S. Mini (ID: 4) - Name formatting issue"""
    faculty_id = 4
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Update the name formatting in database to match JSON
        cursor.execute('''
            UPDATE faculty_profiles 
            SET full_name = 'Dr .S. Mini'
            WHERE id = %s
        ''', (faculty_id,))
        print("Fixed S. Mini name formatting to match JSON")
        return True
    except Exception as e:
        print(f"Error fixing S. Mini name: {e}")
        return False

def fix_veena_publication(cursor):
    """Fix Dr. Veena Thenkanidiyoor (ID: 1) - Missing 1 publication"""
    faculty_id = 1
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Veena
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Veena_Thenkanidiyoor.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        publications = faculty_data.get('publications', {})
        
        # Get current publications count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        # Calculate expected count from JSON
        json_count = sum(len(publications.get(pub_type, [])) for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'])
        
        print(f"Veena - DB: {db_count}, JSON: {json_count}")
        
        if db_count < json_count:
            # Find and insert missing publications
            existing_pubs = set()
            cursor.execute('SELECT title FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
            for row in cursor.fetchall():
                existing_pubs.add(row[0].strip())
            
            for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
                for pub in publications.get(pub_type, []):
                    pub_clean = pub.strip()
                    if pub_clean and pub_clean not in existing_pubs:
                        ptype = 'journal' if pub_type == 'journal' else \
                                'conference' if pub_type == 'conference' else \
                                'proceedings' if pub_type == 'proceedings' else \
                                'chapter' if pub_type == 'bookChapters' else \
                                'book' if pub_type == 'booksAuthored' else 'other'
                        
                        cursor.execute('''
                            INSERT INTO faculty_publications (faculty_id, title, publication_type)
                            VALUES (%s, %s, %s)
                        ''', (faculty_id, pub_clean[:500], ptype))
                        print(f"Inserted missing publication: {pub_clean[:50]}...")
                        break  # Only insert one missing publication
            return True
            
    except Exception as e:
        print(f"Error fixing Veena publications: {e}")
        return False

def fix_trilochan_academic(cursor):
    """Fix Dr. Trilochan Panigrahi (ID: 17) - Missing 1 academic record"""
    faculty_id = 17
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Trilochan
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json/Trilochan_Panigrahi.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Trilochan - DB: {db_count}, JSON: {len(academic_info)}")
        
        if db_count < len(academic_info):
            # Find and insert missing academic record
            existing_records = set()
            cursor.execute('SELECT degree, institute, year FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
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
                
                record_key = (degree, institute, year)
                if record_key not in existing_records:
                    cursor.execute('''
                        INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (faculty_id, degree, institute, year, subject))
                    print(f"Inserted missing academic record: {degree} from {institute}")
                    break  # Only insert one missing record
            return True
            
    except Exception as e:
        print(f"Error fixing Trilochan academic info: {e}")
        return False

def main():
    try:
        print("🔧 FIXING SPECIFIC FACULTY ISSUES (4 faculty only)")
        print("🔒 PROTECTED FACULTY IDs:", PROTECTED_FACULTY_IDS)
        print("✅ ALLOWED TO MODIFY:", ALLOWED_FACULTY_IDS)
        print()
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        fixes_applied = 0
        
        # Fix Modi Chirag (ID: 7) - Missing publication
        print("1. Fixing Modi Chirag publication...")
        if fix_modi_chirag_publication(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix S. Mini (ID: 4) - Name formatting
        print("2. Fixing S. Mini name formatting...")
        if fix_s_mini_name(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Veena (ID: 1) - Missing publication
        print("3. Fixing Veena publication...")
        if fix_veena_publication(cursor):
            fixes_applied += 1
            conn.commit()
        
        # Fix Trilochan (ID: 17) - Missing academic record
        print("4. Fixing Trilochan academic record...")
        if fix_trilochan_academic(cursor):
            fixes_applied += 1
            conn.commit()
        
        print(f"\n✅ Applied {fixes_applied}/4 fixes successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
