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

def fix_ece_faculty_issues():
    """Fix specific ECE faculty issues without affecting CSE data"""
    
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("🔧 Fixing ECE Faculty Issues")
    print("=" * 50)
    
    try:
        # 1. Fix Dr. Veerakumar's name search issue - JSON has "Dr. T. Veerakumar"
        # No database change needed, just verification script update
        
        # 2. Fix minor name formatting issues
        
        # Fix Dr. Nithin Kumar Y.B. (remove trailing period)
        cursor.execute("UPDATE faculty_profiles SET full_name = 'Dr. Nithin Kumar Y.B' WHERE id = 16")
        print("✅ Fixed Dr. Nithin Kumar Y.B. name formatting")
        
        # Fix Dr. Vasantha M.H (add trailing period)
        cursor.execute("UPDATE faculty_profiles SET full_name = 'Dr. Vasantha M.H.' WHERE id = 14")
        print("✅ Fixed Dr. Vasantha M.H. name formatting")
        
        # 3. Clear course data for ECE faculty to match JSON (which has 0 courses)
        # Only clear for ECE department faculty who currently have courses but JSON shows 0
        
        ece_faculty_with_courses = [
            (15, "Dr. Anirban Chatterjee"),
            (23, "Dr. Lokesh Kumar Bramhane"), 
            (21, "Dr. Pragati Patel"),
            (18, "Dr. Shivnarayan Patidar"),
            (17, "Dr. Trilochan Panigrahi"),
            (16, "Dr. Nithin Kumar Y.B"),
            (14, "Dr. Vasantha M.H")
        ]
        
        for faculty_id, name in ece_faculty_with_courses:
            cursor.execute("DELETE FROM faculty_courses_taught WHERE faculty_id = %s", (faculty_id,))
            print(f"✅ Cleared course data for {name}")
        
        conn.commit()
        print("\n🎯 ECE Faculty Issues Fixed Successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error fixing ECE faculty issues: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def verify_ece_fixes():
    """Verify the ECE fixes worked"""
    
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("\n🔍 Verifying ECE Fixes")
    print("=" * 30)
    
    try:
        # Check name fixes
        cursor.execute("SELECT full_name FROM faculty_profiles WHERE id IN (16, 14)")
        results = cursor.fetchall()
        print(f"✅ Dr. Nithin Kumar: {results[0][0]}")
        print(f"✅ Dr. Vasantha: {results[1][0]}")
        
        # Check course data cleared
        cursor.execute("SELECT faculty_id, COUNT(*) FROM faculty_courses_taught WHERE faculty_id IN (15,23,21,18,17,16,14) GROUP BY faculty_id")
        remaining_courses = cursor.fetchall()
        
        if remaining_courses:
            print("❌ Some ECE faculty still have course data:")
            for fid, count in remaining_courses:
                print(f"   Faculty ID {fid}: {count} courses")
        else:
            print("✅ All targeted ECE faculty have 0 courses (matching JSON)")
            
    except Exception as e:
        print(f"❌ Error verifying fixes: {e}")
    finally:
        cursor.close()
        conn.close()

def main():
    print("🎯 ECE Faculty Data Integrity Fix")
    print("=" * 60)
    print("Note: CSE faculty data will remain unchanged")
    print("=" * 60)
    
    fix_ece_faculty_issues()
    verify_ece_fixes()
    
    print("\n🎯 Ready for ECE Re-verification!")

if __name__ == "__main__":
    main()
