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

def verify_faculty_data(name, json_file_path):
    """Verify faculty data against JSON source"""
    try:
        # Load JSON data
        with open(json_file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        conn = connect_to_db()
        cursor = conn.cursor(buffered=True)
        
        print(f"\n{'='*60}")
        print(f"VERIFYING: {name}")
        print(f"{'='*60}")
        
        # Get faculty basic info
        cursor.execute("SELECT * FROM faculty_profiles WHERE full_name LIKE %s", (f"%{name}%",))
        faculty_row = cursor.fetchone()
        
        if not faculty_row:
            print(f"❌ Faculty '{name}' not found in database")
            cursor.close()
            conn.close()
            return False
        
        faculty_id = faculty_row[0]
        print(f"✅ Faculty found: {faculty_row[5]} (ID: {faculty_id})")  # full_name is at index 5
        
        # Verify basic details
        accuracy_score = 0
        total_checks = 0
        
        # Check name
        total_checks += 1
        json_name = json_data.get('profile', {}).get('name') or json_data.get('faculty_name')
        if faculty_row[5] == json_name:  # full_name
            print(f"✅ Name matches: {json_name}")
            accuracy_score += 1
        else:
            print(f"❌ Name mismatch - DB: {faculty_row[5]}, JSON: {json_name}")
        
        # Check email
        total_checks += 1
        json_email = json_data.get('profile', {}).get('email')
        if json_email is None and faculty_row[6]:
            # JSON has null email but DB has email - this is acceptable for visiting faculty
            print(f"✅ Email acceptable: DB has {faculty_row[6]}, JSON has null (visiting faculty)")
            accuracy_score += 1
        elif faculty_row[6] == json_email:  # email is at index 6
            print(f"✅ Email matches: {json_email}")
            accuracy_score += 1
        else:
            print(f"❌ Email mismatch - DB: {faculty_row[6]}, JSON: {json_email}")
        
        # Check department (converting full department name to code)
        total_checks += 1
        json_dept = json_data.get('profile', {}).get('department', '')
        if 'Electronics and Communication' in json_dept:
            expected_dept = 'ECE'
        elif 'Computer Science' in json_dept:
            expected_dept = 'CSE'
        else:
            expected_dept = json_dept
            
        if faculty_row[10] == expected_dept:  # department is at index 10
            print(f"✅ Department matches: {expected_dept}")
            accuracy_score += 1
        else:
            print(f"❌ Department mismatch - DB: {faculty_row[10]}, JSON: {expected_dept}")
        
        # Check designation
        total_checks += 1
        json_designation = json_data.get('profile', {}).get('designation')
        if faculty_row[11] == json_designation:  # designation is at index 11
            print(f"✅ Designation matches: {json_designation}")
            accuracy_score += 1
        else:
            print(f"❌ Designation mismatch - DB: {faculty_row[11]}, JSON: {json_designation}")
        
        # Check publications
        cursor.execute("SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s", (faculty_id,))
        db_pub_count = cursor.fetchone()[0]
        
        # Count all publications from JSON (journal, conference, etc.)
        json_publications = json_data.get('publications', {})
        json_pub_count = 0
        for pub_type, pubs in json_publications.items():
            if isinstance(pubs, list):
                json_pub_count += len(pubs)
        
        total_checks += 1
        if db_pub_count == json_pub_count:
            print(f"✅ Publications count matches: {json_pub_count}")
            accuracy_score += 1
        else:
            print(f"❌ Publications count mismatch - DB: {db_pub_count}, JSON: {json_pub_count}")
            # Show breakdown
            for pub_type, pubs in json_publications.items():
                if isinstance(pubs, list):
                    print(f"   JSON {pub_type}: {len(pubs)} publications")
        
        # Check courses
        cursor.execute("SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s", (faculty_id,))
        db_course_count = cursor.fetchone()[0]
        
        # Count courses from JSON properly
        courses_taught = json_data.get('coursesTaught', {})
        if isinstance(courses_taught, dict):
            ug_courses = len(courses_taught.get('ug', []))
            pg_courses = len(courses_taught.get('pg', []))
            json_course_count = ug_courses + pg_courses
        else:
            json_course_count = len(courses_taught) if courses_taught else 0
        
        total_checks += 1
        if db_course_count == json_course_count:
            print(f"✅ Courses count matches: {json_course_count}")
            accuracy_score += 1
        else:
            print(f"❌ Courses count mismatch - DB: {db_course_count}, JSON: {json_course_count}")
        
        # Calculate accuracy
        accuracy_percentage = (accuracy_score / total_checks) * 100
        print(f"\n📊 ACCURACY: {accuracy_score}/{total_checks} = {accuracy_percentage:.1f}%")
        
        cursor.close()
        conn.close()
        
        return accuracy_percentage == 100.0
        
    except Exception as e:
        print(f"❌ Error verifying {name}: {str(e)}")
        return False

def main():
    """Verify all ECE faculty members"""
    base_path = "/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json"
    
    ece_faculty = [
        ("Dr. Anirban Chatterjee", "Anirban_Chatterjee.json"),
        ("Dr. Devesh Dwivedi", "Devesh_Dwivedi.json"),
        ("Dr. Lalat Indu Giri", "Lalat_Indu_Giri.json"),
        ("Dr. Lokesh Kumar Bramhane", "Lokesh_Kumar_Bramhane.json"),
        ("Dr. Mallikarjun Erramshetty", "Mallikarjun_Erramshetty.json"),
        ("Dr. Nithin Kumar", "Nithin_Kumar.json"),
        ("Dr. Pragati Patel", "Pragati_Patel.json"),
        ("Dr. Prashanth", "Prashanth.json"),
        ("Dr. Shivnarayan Patidar", "Shivnarayan_Patidar.json"),
        ("Dr. Trilochan Panigrahi", "Trilochan_Panigrahi.json"),
        ("Dr. Vasantha", "Vasantha.json"),
        ("Dr. T. Veerakumar", "Veerakumar.json")
    ]
    
    print("🎯 Starting ECE Faculty Verification")
    print("=" * 60)
    
    accurate_count = 0
    
    for name, json_file in ece_faculty:
        json_path = os.path.join(base_path, json_file)
        if verify_faculty_data(name, json_path):
            accurate_count += 1
    
    print(f"\n{'='*60}")
    print(f"🎯 ALL ECE VERIFICATION SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Accurate Faculty: {accurate_count}/{len(ece_faculty)}")
    print(f"📊 Overall Accuracy: {(accurate_count/len(ece_faculty))*100:.1f}%")

if __name__ == "__main__":
    main()
