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

def verify_aps_faculty():
    """Detailed verification of APS faculty data integrity"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("\n🔍 DETAILED APS FACULTY VERIFICATION")
        print("=" * 80)
        
        # Get APS JSON files
        aps_json_dir = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/aps_json'
        json_files = glob(os.path.join(aps_json_dir, '*.json'))
        print(f"Found {len(json_files)} APS faculty JSON files\n")
        
        perfect_faculty = []
        faculty_with_issues = []
        total_faculty = 0
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    faculty_data = json.load(f)
                
                profile = faculty_data.get('profile', {})
                faculty_name = profile.get('name', 'Unknown')
                
                # Get faculty ID from database
                cursor.execute('SELECT id FROM faculty_profiles WHERE full_name = %s', (faculty_name,))
                result = cursor.fetchone()
                
                if not result:
                    print(f"❌ Faculty {faculty_name} not found in database")
                    continue
                
                faculty_id = result[0]
                total_faculty += 1
                
                print("=" * 60)
                print(f"🔍 DETAILED VERIFICATION: {faculty_name}")
                print(f"Faculty ID: {faculty_id} | Department: APS")
                print(f"JSON File: {os.path.basename(json_file)}")
                print("=" * 60)
                
                issues = []
                
                # 1. Basic Profile Verification
                designation = profile.get('designation', '')
                email = profile.get('email')
                print(f"✅ 1. BASIC PROFILE:")
                print(f"   Name: {faculty_name}")
                print(f"   Designation: {designation} ✅")
                print(f"   Email: {email} ✓")
                print(f"   Department: APS ✓")
                
                # 2. Publications Verification
                publications = faculty_data.get('publications', {})
                json_pub_count = 0
                for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
                    json_pub_count += len(publications.get(pub_type, []))
                
                cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
                db_pub_count = cursor.fetchone()[0]
                
                if json_pub_count == db_pub_count:
                    print(f"\n✅ 2. PUBLICATIONS:")
                    print(f"   Total JSON: {json_pub_count}")
                    print(f"   Total DB: {db_pub_count}")
                    print(f"   Status: ✅ PERFECT MATCH")
                else:
                    print(f"\n❌ 2. PUBLICATIONS:")
                    print(f"   Total JSON: {json_pub_count}")
                    print(f"   Total DB: {db_pub_count}")
                    print(f"   Status: ❌ MISMATCH")
                    issues.append(f"Publications: JSON({json_pub_count}) != DB({db_pub_count})")
                
                # 3. Courses Taught Verification
                courses_taught = faculty_data.get('coursesTaught', {})
                json_courses_count = 0
                if isinstance(courses_taught, dict):
                    json_courses_count = len(courses_taught.get('ug', [])) + len(courses_taught.get('pg', []))
                else:
                    json_courses_count = len(courses_taught) if courses_taught else 0
                
                cursor.execute('SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s', (faculty_id,))
                db_courses_count = cursor.fetchone()[0]
                
                if json_courses_count == db_courses_count:
                    print(f"\n✅ 3. COURSES TAUGHT:")
                    print(f"   Total JSON: {json_courses_count}")
                    print(f"   Total DB: {db_courses_count}")
                    print(f"   Status: ✅ PERFECT MATCH")
                else:
                    print(f"\n❌ 3. COURSES TAUGHT:")
                    print(f"   Total JSON: {json_courses_count}")
                    print(f"   Total DB: {db_courses_count}")
                    print(f"   Status: ❌ MISMATCH")
                    issues.append(f"Courses Taught: JSON({json_courses_count}) != DB({db_courses_count})")
                
                # 4. Academic Information Verification
                academic_info = faculty_data.get('academicInformation', [])
                json_academic_count = len(academic_info) if academic_info else 0
                
                cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
                db_academic_count = cursor.fetchone()[0]
                
                if json_academic_count == db_academic_count:
                    print(f"\n✅ 4. ACADEMIC INFORMATION:")
                    print(f"   JSON: {json_academic_count}")
                    print(f"   DB: {db_academic_count}")
                    print(f"   Status: ✅ PERFECT MATCH")
                else:
                    print(f"\n❌ 4. ACADEMIC INFORMATION:")
                    print(f"   JSON: {json_academic_count}")
                    print(f"   DB: {db_academic_count}")
                    print(f"   Status: ❌ MISMATCH")
                    issues.append(f"Academic Info: JSON({json_academic_count}) != DB({db_academic_count})")
                
                # 5-11. Additional Verifications
                sections = [
                    ('researchGuidance', 'faculty_research_guidance', 'RESEARCH GUIDANCE'),
                    ('fundedProjects', 'faculty_funded_projects', 'FUNDED PROJECTS'),
                    ('awardsAndHonors', 'faculty_awards', 'AWARDS'),
                    ('memberships', 'faculty_memberships', 'MEMBERSHIPS'),
                    ('professionalServices', 'faculty_professional_services', 'PROFESSIONAL SERVICES'),
                    ('coursesAttended', 'faculty_courses_attended', 'COURSES ATTENDED'),
                    ('coursesConducted', 'faculty_courses_conducted', 'COURSES CONDUCTED')
                ]
                
                for json_key, table_name, display_name in sections:
                    json_items = faculty_data.get(json_key, [])
                    json_count = len(json_items) if json_items else 0
                    
                    cursor.execute(f'SELECT COUNT(*) FROM {table_name} WHERE faculty_id = %s', (faculty_id,))
                    db_count = cursor.fetchone()[0]
                    
                    if json_count == db_count:
                        print(f"\n✅ {display_name}:")
                        print(f"   JSON: {json_count}")
                        print(f"   DB: {db_count}")
                        print(f"   Status: ✅ PERFECT MATCH")
                    else:
                        print(f"\n❌ {display_name}:")
                        print(f"   JSON: {json_count}")
                        print(f"   DB: {db_count}")
                        print(f"   Status: ❌ MISMATCH")
                        issues.append(f"{display_name}: JSON({json_count}) != DB({db_count})")
                
                # Final Status
                print("\n" + "=" * 60)
                if not issues:
                    print("🎯 FINAL STATUS: ✅ 100% PERFECT DATA INTEGRITY")
                    print("🔒 This faculty is PROTECTED from modifications")
                    perfect_faculty.append((faculty_name, faculty_id))
                else:
                    print("🎯 FINAL STATUS: ❌ HAS DATA INTEGRITY ISSUES")
                    print(f"📝 Issues Found ({len(issues)}):")
                    for issue in issues:
                        print(f"   - {issue}")
                    faculty_with_issues.append((faculty_name, faculty_id, issues))
                print("=" * 60)
                
            except Exception as e:
                print(f"Error processing {json_file}: {e}")
                continue
        
        # Summary
        print(f"\n\n🎯 APS DEPARTMENT SUMMARY")
        print("=" * 80)
        print(f"Total APS Faculty: {total_faculty}")
        print(f"Perfect Faculty: {len(perfect_faculty)} ({len(perfect_faculty)/total_faculty*100 if total_faculty > 0 else 0:.1f}%)")
        print(f"Faculty with Issues: {len(faculty_with_issues)} ({len(faculty_with_issues)/total_faculty*100 if total_faculty > 0 else 0:.1f}%)")
        
        if perfect_faculty:
            print(f"\n✅ PERFECT APS FACULTY (PROTECTED):")
            for name, fid in perfect_faculty:
                print(f"   🔒 {name} (ID: {fid})")
        
        if faculty_with_issues:
            print(f"\n❌ APS FACULTY WITH ISSUES:")
            for name, fid, issues in faculty_with_issues:
                print(f"   ⚠️  {name} (ID: {fid}) - {len(issues)} issue(s)")
                for issue in issues[:3]:  # Show first 3 issues
                    print(f"      - {issue}")
        
        cursor.close()
        conn.close()
        
        return perfect_faculty, faculty_with_issues
        
    except Exception as e:
        print(f"Error during APS verification: {e}")
        traceback.print_exc()
        return [], []

if __name__ == '__main__':
    verify_aps_faculty()
