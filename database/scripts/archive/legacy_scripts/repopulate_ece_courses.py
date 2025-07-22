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

def insert_courses_taught(cursor, faculty_id, courses, course_level):
    """Insert courses taught for a faculty member"""
    if not faculty_id or not courses:
        return
    for course in courses:
        try:
            course_text = course if isinstance(course, str) else course.get('info', '')
            cursor.execute('''
                INSERT INTO faculty_courses_taught (faculty_id, course_name, course_level)
                VALUES (%s, %s, %s) AS new_course
                ON DUPLICATE KEY UPDATE course_level = new_course.course_level
            ''', (faculty_id, course_text[:300], course_level))
        except Exception as e:
            print(f"Error inserting course taught for faculty {faculty_id}: {e}")

def repopulate_ece_courses():
    """Re-populate course data for ECE faculty only"""
    
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
    
    print("🔧 Re-populating ECE Faculty Course Data")
    print("=" * 50)
    
    total_courses_added = 0
    
    try:
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
                
                # Get course data from JSON
                courses_taught = json_data.get('coursesTaught', {})
                
                if isinstance(courses_taught, dict):
                    ug_courses = courses_taught.get('ug', [])
                    pg_courses = courses_taught.get('pg', [])
                    
                    # Insert UG courses
                    insert_courses_taught(cursor, faculty_id, ug_courses, 'ug')
                    # Insert PG courses  
                    insert_courses_taught(cursor, faculty_id, pg_courses, 'pg')
                    
                    course_count = len(ug_courses) + len(pg_courses)
                    total_courses_added += course_count
                    
                    if course_count > 0:
                        print(f"✅ {name}: Added {len(ug_courses)} UG + {len(pg_courses)} PG = {course_count} courses")
                    else:
                        print(f"➖ {name}: No courses in JSON (expected)")
                else:
                    print(f"⚠️  {name}: Unexpected coursesTaught format")
                
            except Exception as e:
                print(f"❌ Error processing {name}: {e}")
                continue
        
        conn.commit()
        print(f"\n🎯 Successfully re-populated {total_courses_added} courses for ECE faculty!")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def verify_repopulation():
    """Verify the course repopulation worked"""
    
    conn = connect_to_db()
    cursor = conn.cursor(buffered=True)
    
    print("\n🔍 Verifying Course Repopulation")
    print("=" * 40)
    
    cursor.execute("""
        SELECT fp.full_name, COUNT(fct.id) as course_count
        FROM faculty_profiles fp
        LEFT JOIN faculty_courses_taught fct ON fp.id = fct.faculty_id
        WHERE fp.department = 'ECE'
        GROUP BY fp.id, fp.full_name
        ORDER BY fp.full_name
    """)
    
    results = cursor.fetchall()
    total_courses = 0
    
    for name, count in results:
        total_courses += count
        status = "✅" if count > 0 else "➖"
        print(f"{status} {name}: {count} courses")
    
    print(f"\n📊 Total ECE courses in database: {total_courses}")
    
    cursor.close()
    conn.close()

def main():
    print("🎯 ECE Course Data Recovery")
    print("=" * 60)
    print("Note: This will ONLY affect ECE faculty course data")
    print("CSE and other departments remain unchanged")
    print("=" * 60)
    
    repopulate_ece_courses()
    verify_repopulation()

if __name__ == "__main__":
    main()
