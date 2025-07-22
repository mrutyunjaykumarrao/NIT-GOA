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

# PROTECTED FACULTY IDs - NEVER MODIFY THESE (45 faculty with perfect data integrity)
PROTECTED_FACULTY_IDS = [
    # CSE Perfect Faculty
    6, 4, 10, 76, 5, 2,  # Venkatanareshbabu, Mini, Chandelkar, Keshavamurthy, Pravati, Damodar
    # ECE Perfect Faculty
    22, 20, 23, 19, 17, 14, 13, 21, 18, 16, 15, 24,  # All 12 ECE faculty
    # EEE Perfect Faculty
    28, 25, 27, 26, 30, 29,  # All 6 EEE faculty
    # MCE Perfect Faculty
    41, 40, 37, 39, 35, 36, 44, 38,  # All 8 MCE faculty
    # CVE Perfect Faculty
    46, 48, 47,  # All 3 CVE faculty
    # HSS Perfect Faculty
    65, 64, 66, 63,  # All 4 HSS faculty
    # APS Perfect Faculty
    58, 56, 55, 59, 57, 60  # All 6 APS faculty
]

# ONLY these CSE faculty IDs can be modified (the 3 with issues)
ALLOWED_CSE_FACULTY_IDS = [9, 7, 1]  # Meenakshi Panda, Modi Chirag, Veena Thenkanidiyoor

def fix_meenakshi_panda_academic(cursor):
    """Fix Dr. Meenakshi Panda (ID: 9) - Missing 1 academic record"""
    faculty_id = 9
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Meenakshi Panda
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Meenakshi_Panda.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        academic_info = faculty_data.get('academicInformation', [])
        
        # Get current academic records count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        print(f"Meenakshi Panda - DB: {db_count}, JSON: {len(academic_info)}")
        
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
        print(f"Error fixing Meenakshi Panda academic info: {e}")
        return False

def fix_modi_chirag_publications(cursor):
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
        
        # Get current publication count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        # Count JSON publications
        json_count = 0
        for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
            json_count += len(publications.get(pub_type, []))
        
        print(f"Modi Chirag - DB: {db_count}, JSON: {json_count}")
        
        if db_count < json_count:
            # Get existing publications to avoid duplicates
            cursor.execute('SELECT title FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
            existing_pubs = set(row[0] for row in cursor.fetchall())
            
            new_db_count = db_count  # Initialize the variable
            
            for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
                for pub in publications.get(pub_type, []):
                    pub_clean = pub.strip()
                    if not pub_clean or pub_clean in existing_pubs:
                        continue
                    
                    ptype = 'journal' if pub_type == 'journal' else \
                            'conference' if pub_type == 'conference' else \
                            'proceedings' if pub_type == 'proceedings' else \
                            'chapter' if pub_type == 'bookChapters' else \
                            'book' if pub_type == 'booksAuthored' else 'other'
                    
                    cursor.execute('''
                        INSERT INTO faculty_publications (faculty_id, title, publication_type)
                        VALUES (%s, %s, %s)
                    ''', (faculty_id, pub_clean[:500], ptype))
                    print(f"Inserted publication: {pub_clean[:80]}...")
                    existing_pubs.add(pub_clean)
                    
                    # Check if we've fixed the missing publication
                    cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
                    new_db_count = cursor.fetchone()[0]
                    if new_db_count >= json_count:
                        break
                        
                if new_db_count >= json_count:
                    break
                    
            return True
            
    except Exception as e:
        print(f"Error fixing Modi Chirag publications: {e}")
        return False

def fix_veena_publications(cursor):
    """Fix Dr. Veena Thenkanidiyoor (ID: 1) - Missing 1 publication"""
    faculty_id = 1
    if faculty_id in PROTECTED_FACULTY_IDS:
        print(f"ERROR: Faculty ID {faculty_id} is PROTECTED! Cannot modify.")
        return False
    
    try:
        # Read the JSON file for Veena Thenkanidiyoor
        json_file = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Veena_Thenkanidiyoor.json'
        
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        publications = faculty_data.get('publications', {})
        
        # Get current publication count from DB
        cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
        db_count = cursor.fetchone()[0]
        
        # Count JSON publications
        json_count = 0
        for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
            json_count += len(publications.get(pub_type, []))
        
        print(f"Veena Thenkanidiyoor - DB: {db_count}, JSON: {json_count}")
        
        if db_count < json_count:
            # Get existing publications to avoid duplicates
            cursor.execute('SELECT title FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
            existing_pubs = set(row[0] for row in cursor.fetchall())
            
            new_db_count = db_count  # Initialize the variable
            
            for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
                for pub in publications.get(pub_type, []):
                    pub_clean = pub.strip()
                    if not pub_clean or pub_clean in existing_pubs:
                        continue
                    
                    ptype = 'journal' if pub_type == 'journal' else \
                            'conference' if pub_type == 'conference' else \
                            'proceedings' if pub_type == 'proceedings' else \
                            'chapter' if pub_type == 'bookChapters' else \
                            'book' if pub_type == 'booksAuthored' else 'other'
                    
                    cursor.execute('''
                        INSERT INTO faculty_publications (faculty_id, title, publication_type)
                        VALUES (%s, %s, %s)
                    ''', (faculty_id, pub_clean[:500], ptype))
                    print(f"Inserted publication: {pub_clean[:80]}...")
                    existing_pubs.add(pub_clean)
                    
                    # Check if we've fixed the missing publication
                    cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
                    new_db_count = cursor.fetchone()[0]
                    if new_db_count >= json_count:
                        break
                        
                if new_db_count >= json_count:
                    break
                    
            return True
            
    except Exception as e:
        print(f"Error fixing Veena publications: {e}")
        return False

def main():
    try:
        print("🔧 FIXING FINAL 3 CSE FACULTY ISSUES")
        print("🔒 PROTECTED FACULTY IDs (45 faculty):", len(PROTECTED_FACULTY_IDS), "faculty protected")
        print("✅ ALLOWED TO MODIFY:", ALLOWED_CSE_FACULTY_IDS)
        print()
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        fixes_applied = 0
        
        # Fix Dr. Meenakshi Panda (ID: 9) - Missing 1 academic record
        print("1. Fixing Dr. Meenakshi Panda academic info...")
        if fix_meenakshi_panda_academic(cursor):
            fixes_applied += 1
            conn.commit()
            print("   ✅ Fixed successfully!")
        
        # Fix Dr. Modi Chirag Navinchandra (ID: 7) - Missing 1 publication
        print("\n2. Fixing Dr. Modi Chirag Navinchandra publications...")
        if fix_modi_chirag_publications(cursor):
            fixes_applied += 1
            conn.commit()
            print("   ✅ Fixed successfully!")
        
        # Fix Dr. Veena Thenkanidiyoor (ID: 1) - Missing 1 publication
        print("\n3. Fixing Dr. Veena Thenkanidiyoor publications...")
        if fix_veena_publications(cursor):
            fixes_applied += 1
            conn.commit()
            print("   ✅ Fixed successfully!")
        
        print(f"\n🎉 Applied {fixes_applied}/3 CSE fixes successfully!")
        print("🏆 NIT Goa Faculty Database should now have 100% data integrity!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
