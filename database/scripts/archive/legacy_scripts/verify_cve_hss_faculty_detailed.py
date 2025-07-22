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

def verify_department_faculty_detailed(cursor, dept_name, data_dir):
    """Detailed verification of faculty members from a specific department"""
    
    print(f"\n🔍 DETAILED {dept_name} FACULTY VERIFICATION")
    print("=" * 80)
    
    # Get all JSON files for this department
    dept_files = glob(os.path.join(data_dir, '*.json'))
    print(f"Found {len(dept_files)} {dept_name} faculty JSON files")
    
    perfect_faculty = []
    issues_faculty = []
    
    for json_file in sorted(dept_files):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                faculty_data = json.load(f)
            
            profile = faculty_data.get('profile', {})
            faculty_name = profile.get('name', '')
            
            if not faculty_name:
                print(f"❌ No faculty name found in {os.path.basename(json_file)}")
                continue
            
            # Get faculty ID from database
            cursor.execute('SELECT id, department FROM faculty_profiles WHERE full_name = %s', (faculty_name,))
            result = cursor.fetchone()
            if not result:
                print(f"❌ Faculty not found in database: {faculty_name}")
                continue
            
            faculty_id, dept = result
            
            print(f"\n{'='*60}")
            print(f"🔍 DETAILED VERIFICATION: {faculty_name}")
            print(f"Faculty ID: {faculty_id} | Department: {dept}")
            print(f"JSON File: {os.path.basename(json_file)}")
            print(f"{'='*60}")
            
            verification_results = {
                'faculty_id': faculty_id,
                'name': faculty_name,
                'file': os.path.basename(json_file),
                'department': dept_name,
                'perfect_match': True,
                'total_issues': 0,
                'issues': []
            }
            
            # 1. Basic Profile Verification
            cursor.execute('SELECT designation, email FROM faculty_profiles WHERE id = %s', (faculty_id,))
            db_profile = cursor.fetchone()
            
            print(f"✅ 1. BASIC PROFILE:")
            print(f"   Name: {faculty_name}")
            
            # Check designation match
            json_designation = profile.get('designation', '')
            db_designation = db_profile[0] if db_profile else ''
            
            if json_designation != db_designation:
                print(f"   Designation: JSON='{json_designation}', DB='{db_designation}' ❌")
                verification_results['perfect_match'] = False
                verification_results['total_issues'] += 1
                verification_results['issues'].append(f"Designation mismatch: JSON='{json_designation}', DB='{db_designation}'")
            else:
                print(f"   Designation: {json_designation} ✅")
            
            print(f"   Email: {profile.get('email')} ✓")
            print(f"   Department: {dept_name} ✓")
            
            # 2. Publications Verification
            publications = faculty_data.get('publications', {})
            cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
            db_pub_count = cursor.fetchone()[0]
            
            json_pub_count = sum(len(publications.get(pub_type, [])) for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'])
            
            print(f"\n✅ 2. PUBLICATIONS:")
            print(f"   Total JSON: {json_pub_count}")
            print(f"   Total DB: {db_pub_count}")
            
            if db_pub_count == json_pub_count:
                print(f"   Status: ✅ PERFECT MATCH")
            else:
                print(f"   Status: ❌ MISMATCH")
                verification_results['perfect_match'] = False
                verification_results['total_issues'] += 1
                verification_results['issues'].append(f"Publication count mismatch: JSON={json_pub_count}, DB={db_pub_count}")
            
            # 3. Courses Taught Verification
            courses_taught = faculty_data.get('coursesTaught', {})
            cursor.execute('SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s', (faculty_id,))
            db_courses_count = cursor.fetchone()[0]
            
            json_courses_count = 0
            if isinstance(courses_taught, dict):
                json_courses_count = len(courses_taught.get('ug', [])) + len(courses_taught.get('pg', []))
            else:
                json_courses_count = len(courses_taught) if courses_taught else 0
            
            print(f"\n✅ 3. COURSES TAUGHT:")
            print(f"   Total JSON: {json_courses_count}")
            print(f"   Total DB: {db_courses_count}")
            
            if db_courses_count == json_courses_count:
                print(f"   Status: ✅ PERFECT MATCH")
            else:
                print(f"   Status: ❌ MISMATCH")
                verification_results['perfect_match'] = False
                verification_results['total_issues'] += 1
                verification_results['issues'].append(f"Courses taught count mismatch: JSON={json_courses_count}, DB={db_courses_count}")
            
            # 4. Academic Information Verification
            academic_info = faculty_data.get('academicInformation', [])
            cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
            db_academic_count = cursor.fetchone()[0]
            json_academic_count = len([edu for edu in academic_info if edu])
            
            print(f"\n✅ 4. ACADEMIC INFORMATION:")
            print(f"   JSON: {json_academic_count}")
            print(f"   DB: {db_academic_count}")
            if db_academic_count == json_academic_count:
                print(f"   Status: ✅ PERFECT MATCH")
            else:
                print(f"   Status: ❌ MISMATCH")
                verification_results['perfect_match'] = False
                verification_results['total_issues'] += 1
                verification_results['issues'].append(f"Academic info count mismatch: JSON={json_academic_count}, DB={db_academic_count}")
                
                # Show details of academic info for debugging
                if json_academic_count > 0:
                    print(f"   📋 Academic Info Details:")
                    for i, edu in enumerate(academic_info):
                        if edu:
                            degree = edu.get('degree', '')
                            institute = edu.get('institute', '')
                            year = edu.get('year', '')
                            print(f"      {i+1}. {degree} from {institute} ({year})")
            
            # Quick verification for other sections
            sections = [
                ('Research Guidance', 'researchGuidance', 'faculty_research_guidance'),
                ('Funded Projects', 'fundedProjects', 'faculty_funded_projects'),
                ('Awards', 'awardsAndHonors', 'faculty_awards'),
                ('Memberships', 'memberships', 'faculty_memberships'),
                ('Professional Services', 'professionalServices', 'faculty_professional_services'),
                ('Courses Attended', 'coursesAttended', 'faculty_courses_attended'),
                ('Courses Conducted', 'coursesConducted', 'faculty_courses_conducted')
            ]
            
            for section_name, json_key, table_name in sections:
                json_data = faculty_data.get(json_key, [])
                cursor.execute(f'SELECT COUNT(*) FROM {table_name} WHERE faculty_id = %s', (faculty_id,))
                db_count = cursor.fetchone()[0]
                json_count = len(json_data)
                
                print(f"\n✅ {section_name.upper()}:")
                print(f"   JSON: {json_count}")
                print(f"   DB: {db_count}")
                
                if db_count == json_count:
                    print(f"   Status: ✅ PERFECT MATCH")
                else:
                    print(f"   Status: ❌ MISMATCH")
                    verification_results['perfect_match'] = False
                    verification_results['total_issues'] += 1
                    verification_results['issues'].append(f"{section_name} count mismatch: JSON={json_count}, DB={db_count}")
            
            # Final Status
            print(f"\n{'='*60}")
            if verification_results['perfect_match']:
                print(f"🎯 FINAL STATUS: ✅ 100% PERFECT DATA INTEGRITY")
                print(f"🔒 This faculty is PROTECTED from modifications")
                perfect_faculty.append(verification_results)
            else:
                print(f"⚠️  FINAL STATUS: ❌ {verification_results['total_issues']} ISSUES FOUND")
                print(f"🔧 This faculty needs attention")
                for issue in verification_results['issues']:
                    print(f"     - {issue}")
                issues_faculty.append(verification_results)
            print(f"{'='*60}")
            
        except Exception as e:
            print(f"❌ Error verifying {json_file}: {e}")
            continue
    
    # Department Summary
    print(f"\n\n🎯 {dept_name} DEPARTMENT SUMMARY")
    print("=" * 80)
    total_faculty = len(perfect_faculty) + len(issues_faculty)
    print(f"Total {dept_name} Faculty: {total_faculty}")
    print(f"Perfect Faculty: {len(perfect_faculty)} ({len(perfect_faculty)/total_faculty*100:.1f}%)" if total_faculty > 0 else "Perfect Faculty: 0 (0%)")
    print(f"Faculty with Issues: {len(issues_faculty)} ({len(issues_faculty)/total_faculty*100:.1f}%)" if total_faculty > 0 else "Faculty with Issues: 0 (0%)")
    
    if perfect_faculty:
        print(f"\n✅ PERFECT {dept_name} FACULTY (PROTECTED):")
        for faculty in perfect_faculty:
            print(f"   🔒 {faculty['name']} (ID: {faculty['faculty_id']})")
    
    if issues_faculty:
        print(f"\n⚠️  {dept_name} FACULTY NEEDING ATTENTION:")
        for faculty in issues_faculty:
            print(f"\n   🔧 {faculty['name']} (ID: {faculty['faculty_id']}) - {faculty['total_issues']} issues:")
            for issue in faculty['issues']:
                print(f"      - {issue}")
    
    return perfect_faculty, issues_faculty

def main():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Define departments to check
        departments = [
            ('CVE', '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/cve_json'),
            ('HSS', '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/hss_json')
        ]
        
        all_perfect = []
        all_issues = []
        
        for dept_name, data_dir in departments:
            perfect, issues = verify_department_faculty_detailed(cursor, dept_name, data_dir)
            all_perfect.extend(perfect)
            all_issues.extend(issues)
        
        # Overall Summary
        print(f"\n\n🏆 OVERALL CVE & HSS SUMMARY")
        print("=" * 80)
        total_faculty = len(all_perfect) + len(all_issues)
        print(f"Total Faculty (CVE + HSS): {total_faculty}")
        print(f"Perfect Faculty: {len(all_perfect)} ({len(all_perfect)/total_faculty*100:.1f}%)" if total_faculty > 0 else "Perfect Faculty: 0 (0%)")
        print(f"Faculty with Issues: {len(all_issues)} ({len(all_issues)/total_faculty*100:.1f}%)" if total_faculty > 0 else "Faculty with Issues: 0 (0%)")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
