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

def verify_courses_with_json():
    """Verify course data in database against JSON files"""
    
    base_path = "/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json"
    
    ece_faculty = [
        ("Dr. Anirban Chatterjee", "Anirban_Chatterjee.json"),
        ("Dr. Devesh Dwivedi", "Devesh_Dwivedi.json"),
        ("Dr. Lalat Indu Giri", "Lalat_Indu_Giri.json"),
        ("Dr. Lokesh Kumar Bramhane", "Lokesh_Kumar_Bramhane.json"),
        ("Dr. Mallikarjun Erramshetty", "Mallikarjun_Erramshetty.json"),
        ("Dr. Nithin Kumar Y.B", "Nithin_Kumar.json"),
        ("Dr. Pragati Patel", "Pragati_Patel.json"),
        ("Dr. Prashanth G.R", "Prashanth.json"),
        ("Dr. Shivnarayan Patidar", "Shivnarayan_Patidar.json"),
        ("Dr. Trilochan Panigrahi", "Trilochan_Panigrahi.json"),
        ("Dr. Vasantha M.H.", "Vasantha.json"),
        ("Dr. T. Veerakumar", "Veerakumar.json")
    ]
    
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("🔍 ECE Faculty Course Data Analysis")
    print("=" * 60)
    
    total_expected_courses = 0
    total_db_courses = 0
    
    for name, json_file in ece_faculty:
        json_path = os.path.join(base_path, json_file)
        
        try:
            # Load JSON data
            with open(json_path, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
            
            # Get faculty ID from database
            cursor.execute("SELECT id FROM faculty_profiles WHERE full_name LIKE %s", (f"%{name}%",))
            faculty_row = cursor.fetchone()
            
            if not faculty_row:
                print(f"❌ {name}: Not found in database")
                continue
                
            faculty_id = faculty_row[0]
            
            # Count courses in JSON
            courses_taught = json_data.get('coursesTaught', {})
            ug_courses = len(courses_taught.get('ug', []))
            pg_courses = len(courses_taught.get('pg', []))
            json_total = ug_courses + pg_courses
            
            # Count courses in database
            cursor.execute("SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s", (faculty_id,))
            db_total = cursor.fetchone()[0]
            
            total_expected_courses += json_total
            total_db_courses += db_total
            
            status = "✅" if db_total == json_total else "❌"
            print(f"{status} {name}")
            print(f"   JSON: {ug_courses} UG + {pg_courses} PG = {json_total} courses")
            print(f"   DB:   {db_total} courses")
            
            if json_total > 0 and db_total == 0:
                print(f"   📋 Expected UG courses: {courses_taught.get('ug', [])}")
                print(f"   📋 Expected PG courses: {courses_taught.get('pg', [])}")
            
            print()
            
        except Exception as e:
            print(f"❌ Error processing {name}: {e}")
    
    print("=" * 60)
    print(f"📊 SUMMARY:")
    print(f"   Expected total courses: {total_expected_courses}")
    print(f"   Database total courses: {total_db_courses}")
    print(f"   Missing courses: {total_expected_courses - total_db_courses}")
    
    cursor.close()
    conn.close()

def main():
    verify_courses_with_json()

if __name__ == "__main__":
    main()
