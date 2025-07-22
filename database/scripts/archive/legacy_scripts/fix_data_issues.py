import mysql.connector
import json
import os

# Database connection
def connect_to_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Mrutyu@2026',
        database='nitgoa_db',
        buffered=True
    )

def fix_specific_data_issues():
    """Fix specific data discrepancies identified in comprehensive verification"""
    
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("🔧 Fixing Specific Data Issues")
    print("=" * 50)
    
    try:
        # 1. Fix Dr. Veena's missing publication
        print("📚 Fixing Dr. Veena Thenkanidiyoor's publications...")
        
        # First, clear existing publications to re-populate cleanly
        cursor.execute("DELETE FROM faculty_publications WHERE faculty_id = 1")
        
        # Load Dr. Veena's JSON
        with open('/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json/Veena_Thenkanidiyoor.json', 'r') as f:
            veena_data = json.load(f)
        
        # Re-insert all publications
        publications = veena_data.get('publications', {})
        count = 0
        for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
            for pub in publications.get(pub_type, []):
                try:
                    pub_clean = pub.strip()
                    if not pub_clean:
                        continue
                        
                    ptype = 'journal' if pub_type == 'journal' else \
                            'conference' if pub_type == 'conference' else \
                            'proceedings' if pub_type == 'proceedings' else \
                            'chapter' if pub_type == 'bookChapters' else \
                            'book' if pub_type == 'booksAuthored' else 'other'
                    
                    cursor.execute('''
                        INSERT INTO faculty_publications (faculty_id, title, publication_type)
                        VALUES (%s, %s, %s)
                    ''', (1, pub_clean[:500], ptype))
                    count += 1
                except Exception as e:
                    print(f"Error inserting publication: {e}")
        
        print(f"✅ Re-inserted {count} publications for Dr. Veena")
        
        # 2. Fix Dr. Trilochan's missing academic info
        print("🎓 Fixing Dr. Trilochan Panigrahi's academic information...")
        
        # First, clear existing academic info to re-populate cleanly
        cursor.execute("DELETE FROM faculty_academic_info WHERE faculty_id = 17")
        
        # Load Dr. Trilochan's JSON
        with open('/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json/Trilochan_Panigrahi.json', 'r') as f:
            trilochan_data = json.load(f)
        
        # Re-insert all academic information
        academic_info = trilochan_data.get('academicInformation', [])
        count = 0
        for edu in academic_info:
            try:
                if not edu:
                    continue
                    
                degree = edu.get('degree', '') if edu.get('degree') is not None else ''
                institute = edu.get('institute', '') if edu.get('institute') is not None else ''
                year = edu.get('year', '') if edu.get('year') is not None else ''
                subject = edu.get('subject', '') if edu.get('subject') is not None else ''
                
                cursor.execute('''
                    INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (17, degree, institute, year, subject))
                count += 1
                print(f"   ✅ Added: {degree} from {institute} ({year})")
            except Exception as e:
                print(f"Error inserting academic info: {e}")
        
        print(f"✅ Re-inserted {count} academic records for Dr. Trilochan")
        
        conn.commit()
        print("\n🎯 All data issues fixed successfully!")
        
    except Exception as e:
        print(f"❌ Error fixing data issues: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def verify_fixes():
    """Verify the fixes worked"""
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("\n🔍 Verifying Fixes")
    print("=" * 30)
    
    # Check Dr. Veena's publications
    cursor.execute("SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = 1")
    veena_pubs = cursor.fetchone()[0]
    print(f"✅ Dr. Veena publications: {veena_pubs} (should be 27)")
    
    # Check Dr. Trilochan's academic info
    cursor.execute("SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = 17")
    trilochan_academic = cursor.fetchone()[0]
    print(f"✅ Dr. Trilochan academic records: {trilochan_academic} (should be 2)")
    
    cursor.close()
    conn.close()

def main():
    print("🎯 Fixing Comprehensive Verification Issues")
    print("=" * 60)
    
    fix_specific_data_issues()
    verify_fixes()

if __name__ == "__main__":
    main()
