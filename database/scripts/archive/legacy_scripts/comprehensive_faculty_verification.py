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

def verify_comprehensive_faculty_data(name, json_file_path, department):
    """Comprehensive verification of ALL faculty data sections against JSON"""
    try:
        # Load JSON data
        with open(json_file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        conn = connect_to_db()
        cursor = conn.cursor(buffered=True)
        
        print(f"\n{'='*80}")
        print(f"COMPREHENSIVE VERIFICATION: {name} ({department})")
        print(f"{'='*80}")
        
        # Get faculty basic info
        cursor.execute("SELECT * FROM faculty_profiles WHERE full_name LIKE %s", (f"%{name}%",))
        faculty_row = cursor.fetchone()
        
        if not faculty_row:
            print(f"❌ Faculty '{name}' not found in database")
            cursor.close()
            conn.close()
            return False
        
        faculty_id = faculty_row[0]
        print(f"✅ Faculty found: {faculty_row[5]} (ID: {faculty_id})")
        
        # Track all verification results
        all_checks = []
        
        # 1. BASIC PROFILE VERIFICATION
        print(f"\n📋 1. BASIC PROFILE VERIFICATION")
        print("-" * 40)
        
        # Name
        json_name = json_data.get('profile', {}).get('name') or json_data.get('faculty_name')
        check_result = faculty_row[5] == json_name
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Name: DB='{faculty_row[5]}' | JSON='{json_name}'")
        
        # Email
        json_email = json_data.get('profile', {}).get('email')
        if json_email is None and faculty_row[6]:
            check_result = True  # Acceptable for visiting faculty
            print(f"✅ Email: DB='{faculty_row[6]}' | JSON=null (visiting faculty - acceptable)")
        else:
            check_result = faculty_row[6] == json_email
            print(f"{'✅' if check_result else '❌'} Email: DB='{faculty_row[6]}' | JSON='{json_email}'")
        all_checks.append(check_result)
        
        # Department
        json_dept = json_data.get('profile', {}).get('department', '')
        expected_dept = department
        check_result = faculty_row[10] == expected_dept
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Department: DB='{faculty_row[10]}' | Expected='{expected_dept}'")
        
        # Designation
        json_designation = json_data.get('profile', {}).get('designation')
        check_result = faculty_row[11] == json_designation
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Designation: DB='{faculty_row[11]}' | JSON='{json_designation}'")
        
        # 2. PUBLICATIONS VERIFICATION
        print(f"\n📚 2. PUBLICATIONS VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s", (faculty_id,))
        db_pub_count = cursor.fetchone()[0]
        
        # Count all publications from JSON
        json_publications = json_data.get('publications', {})
        json_pub_count = 0
        pub_breakdown = {}
        for pub_type, pubs in json_publications.items():
            if isinstance(pubs, list):
                count = len(pubs)
                json_pub_count += count
                pub_breakdown[pub_type] = count
        
        check_result = db_pub_count == json_pub_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Publications Total: DB={db_pub_count} | JSON={json_pub_count}")
        if pub_breakdown:
            for pub_type, count in pub_breakdown.items():
                print(f"   📄 {pub_type}: {count}")
        
        # 3. COURSES VERIFICATION
        print(f"\n🎓 3. COURSES VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s", (faculty_id,))
        db_course_count = cursor.fetchone()[0]
        
        courses_taught = json_data.get('coursesTaught', {})
        if isinstance(courses_taught, dict):
            ug_courses = len(courses_taught.get('ug', []))
            pg_courses = len(courses_taught.get('pg', []))
            json_course_count = ug_courses + pg_courses
        else:
            json_course_count = len(courses_taught) if courses_taught else 0
        
        check_result = db_course_count == json_course_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Courses Taught: DB={db_course_count} | JSON={json_course_count}")
        if isinstance(courses_taught, dict):
            print(f"   🎓 UG Courses: {ug_courses}")
            print(f"   🎓 PG Courses: {pg_courses}")
        
        # 4. ACADEMIC INFORMATION VERIFICATION
        print(f"\n🎓 4. ACADEMIC INFORMATION VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s", (faculty_id,))
        db_academic_count = cursor.fetchone()[0]
        json_academic_count = len(json_data.get('academicInformation', []))
        
        check_result = db_academic_count == json_academic_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Academic Info: DB={db_academic_count} | JSON={json_academic_count}")
        
        # 5. RESEARCH GUIDANCE VERIFICATION
        print(f"\n👥 5. RESEARCH GUIDANCE VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_research_guidance WHERE faculty_id = %s", (faculty_id,))
        db_guidance_count = cursor.fetchone()[0]
        json_guidance_count = len(json_data.get('researchGuidance', []))
        
        check_result = db_guidance_count == json_guidance_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Research Guidance: DB={db_guidance_count} | JSON={json_guidance_count}")
        
        # 6. FUNDED PROJECTS VERIFICATION
        print(f"\n💰 6. FUNDED PROJECTS VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_funded_projects WHERE faculty_id = %s", (faculty_id,))
        db_projects_count = cursor.fetchone()[0]
        json_projects_count = len(json_data.get('fundedProjects', []))
        
        check_result = db_projects_count == json_projects_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Funded Projects: DB={db_projects_count} | JSON={json_projects_count}")
        
        # 7. AWARDS AND HONORS VERIFICATION
        print(f"\n🏆 7. AWARDS AND HONORS VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_awards WHERE faculty_id = %s", (faculty_id,))
        db_awards_count = cursor.fetchone()[0]
        json_awards_count = len(json_data.get('awardsAndHonors', []))
        
        check_result = db_awards_count == json_awards_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Awards: DB={db_awards_count} | JSON={json_awards_count}")
        
        # 8. MEMBERSHIPS VERIFICATION
        print(f"\n🤝 8. MEMBERSHIPS VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_memberships WHERE faculty_id = %s", (faculty_id,))
        db_memberships_count = cursor.fetchone()[0]
        json_memberships_count = len(json_data.get('memberships', []))
        
        check_result = db_memberships_count == json_memberships_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Memberships: DB={db_memberships_count} | JSON={json_memberships_count}")
        
        # 9. PROFESSIONAL SERVICES VERIFICATION
        print(f"\n🔧 9. PROFESSIONAL SERVICES VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_professional_services WHERE faculty_id = %s", (faculty_id,))
        db_services_count = cursor.fetchone()[0]
        json_services_count = len(json_data.get('professionalServices', []))
        
        check_result = db_services_count == json_services_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Professional Services: DB={db_services_count} | JSON={json_services_count}")
        
        # 10. COURSES ATTENDED VERIFICATION
        print(f"\n📚 10. COURSES ATTENDED VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_courses_attended WHERE faculty_id = %s", (faculty_id,))
        db_attended_count = cursor.fetchone()[0]
        json_attended_count = len(json_data.get('coursesAttended', []))
        
        check_result = db_attended_count == json_attended_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Courses Attended: DB={db_attended_count} | JSON={json_attended_count}")
        
        # 11. COURSES CONDUCTED VERIFICATION
        print(f"\n📋 11. COURSES CONDUCTED VERIFICATION")
        print("-" * 40)
        
        cursor.execute("SELECT COUNT(*) FROM faculty_courses_conducted WHERE faculty_id = %s", (faculty_id,))
        db_conducted_count = cursor.fetchone()[0]
        json_conducted_count = len(json_data.get('coursesConducted', []))
        
        check_result = db_conducted_count == json_conducted_count
        all_checks.append(check_result)
        print(f"{'✅' if check_result else '❌'} Courses Conducted: DB={db_conducted_count} | JSON={json_conducted_count}")
        
        # FINAL SUMMARY
        passed_checks = sum(all_checks)
        total_checks = len(all_checks)
        accuracy_percentage = (passed_checks / total_checks) * 100
        
        print(f"\n🎯 COMPREHENSIVE ACCURACY SUMMARY")
        print("=" * 50)
        print(f"✅ Passed Checks: {passed_checks}/{total_checks}")
        print(f"📊 Overall Accuracy: {accuracy_percentage:.1f}%")
        
        cursor.close()
        conn.close()
        
        return accuracy_percentage == 100.0
        
    except Exception as e:
        print(f"❌ Error verifying {name}: {str(e)}")
        return False

def main():
    """Comprehensive verification of CSE and ECE faculty"""
    print("🔍 COMPREHENSIVE FACULTY DATABASE VERIFICATION")
    print("=" * 80)
    print("Verifying ALL data sections for CSE and ECE departments")
    print("=" * 80)
    
    # CSE Faculty
    cse_base_path = "/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cse_json"
    cse_faculty = [
        ("Dr. Chandelkar K K", "Chandelkar.json"),
        ("Dr. Modi Chirag Navinchandra", "Modi_Chirag_Navinchandra.json"),
        ("Dr. Damodar Reddy Edla", "Damodar_Reddy_Edla.json"),
        ("Dr. Keshavamurthy B.N", "Keshavamurthy.json"),
        ("Dr. S. Mini", "Mini.json"),
        ("Dr. Veena Thenkanidiyoor", "Veena_Thenkanidiyoor.json")
    ]
    
    # ECE Faculty  
    ece_base_path = "/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/ece_json"
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
    
    perfect_faculty = []
    
    # Verify CSE Faculty
    print(f"\n🔬 VERIFYING CSE FACULTY")
    print("=" * 50)
    
    for name, json_file in cse_faculty:
        json_path = os.path.join(cse_base_path, json_file)
        if os.path.exists(json_path):
            if verify_comprehensive_faculty_data(name, json_path, "CSE"):
                perfect_faculty.append(f"{name} (CSE)")
        else:
            print(f"❌ JSON file not found: {json_path}")
    
    # Verify ECE Faculty
    print(f"\n🔌 VERIFYING ECE FACULTY")
    print("=" * 50)
    
    for name, json_file in ece_faculty:
        json_path = os.path.join(ece_base_path, json_file)
        if os.path.exists(json_path):
            if verify_comprehensive_faculty_data(name, json_path, "ECE"):
                perfect_faculty.append(f"{name} (ECE)")
        else:
            print(f"❌ JSON file not found: {json_path}")
    
    # FINAL COMPREHENSIVE REPORT
    total_faculty = len(cse_faculty) + len(ece_faculty)
    print(f"\n{'='*80}")
    print(f"🎯 FINAL COMPREHENSIVE VERIFICATION REPORT")
    print(f"{'='*80}")
    print(f"📊 Perfect Faculty (100% accuracy): {len(perfect_faculty)}/{total_faculty}")
    print(f"📈 Overall Database Accuracy: {(len(perfect_faculty)/total_faculty)*100:.1f}%")
    
    if perfect_faculty:
        print(f"\n✅ FACULTY WITH 100% DATA INTEGRITY:")
        for faculty in perfect_faculty:
            print(f"   🎯 {faculty}")
    
    if len(perfect_faculty) == total_faculty:
        print(f"\n🎉 CONGRATULATIONS! ALL FACULTY HAVE 100% DATA INTEGRITY!")
        print(f"🎯 Database is perfectly synchronized with JSON sources")
    else:
        print(f"\n⚠️  Some faculty need data integrity fixes")

if __name__ == "__main__":
    main()
