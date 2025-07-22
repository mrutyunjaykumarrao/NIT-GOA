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

DATA_DIR = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data'

def get_all_json_files():
    """Get all JSON files from all department folders"""
    json_files = []
    for dept_folder in ['aps_json', 'cse_json', 'cve_json', 'ece_json', 'eee_json', 'hss_json', 'mce_json']:
        dept_path = os.path.join(DATA_DIR, dept_folder)
        if os.path.exists(dept_path):
            dept_files = glob(os.path.join(dept_path, '*.json'))
            json_files.extend(dept_files)
    return json_files

def verify_faculty_comprehensive(cursor, json_file):
    """Comprehensive verification of a single faculty member"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        profile = faculty_data.get('profile', {})
        faculty_name = profile.get('name', '')
        
        if not faculty_name:
            return None, "No faculty name found"
        
        # Get faculty ID from database
        cursor.execute('SELECT id FROM faculty_profiles WHERE full_name = %s', (faculty_name,))
        result = cursor.fetchone()
        if not result:
            return None, f"Faculty not found in database: {faculty_name}"
        
        faculty_id = result[0]
        verification_results = {
            'faculty_id': faculty_id,
            'name': faculty_name,
            'file': os.path.basename(json_file),
            'sections': {},
            'perfect_match': True,
            'issues': []
        }
        
        # 1. Verify Basic Profile
        cursor.execute('SELECT designation, department, email FROM faculty_profiles WHERE id = %s', (faculty_id,))
        db_profile = cursor.fetchone()
        
        profile_issues = []
        if profile.get('designation') != db_profile[0]:
            profile_issues.append(f"Designation mismatch: JSON='{profile.get('designation')}', DB='{db_profile[0]}'")
        
        verification_results['sections']['profile'] = {
            'status': 'PASS' if not profile_issues else 'FAIL',
            'issues': profile_issues
        }
        
        if profile_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(profile_issues)
        
        # 2. Verify Publications
        publications = faculty_data.get('publications', {})
        cursor.execute('SELECT COUNT(*) FROM faculty_publications WHERE faculty_id = %s', (faculty_id,))
        db_pub_count = cursor.fetchone()[0]
        
        json_pub_count = sum(len(publications.get(pub_type, [])) for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'])
        
        pub_issues = []
        if db_pub_count != json_pub_count:
            pub_issues.append(f"Publication count mismatch: JSON={json_pub_count}, DB={db_pub_count}")
        
        verification_results['sections']['publications'] = {
            'status': 'PASS' if not pub_issues else 'FAIL',
            'issues': pub_issues,
            'json_count': json_pub_count,
            'db_count': db_pub_count
        }
        
        if pub_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(pub_issues)
        
        # 3. Verify Courses Taught
        courses_taught = faculty_data.get('coursesTaught', {})
        cursor.execute('SELECT COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s', (faculty_id,))
        db_courses_count = cursor.fetchone()[0]
        
        json_courses_count = 0
        if isinstance(courses_taught, dict):
            json_courses_count = len(courses_taught.get('ug', [])) + len(courses_taught.get('pg', []))
        else:
            json_courses_count = len(courses_taught) if courses_taught else 0
        
        course_issues = []
        if db_courses_count != json_courses_count:
            course_issues.append(f"Courses taught count mismatch: JSON={json_courses_count}, DB={db_courses_count}")
        
        verification_results['sections']['courses_taught'] = {
            'status': 'PASS' if not course_issues else 'FAIL',
            'issues': course_issues,
            'json_count': json_courses_count,
            'db_count': db_courses_count
        }
        
        if course_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(course_issues)
        
        # 4. Verify Academic Information
        academic_info = faculty_data.get('academicInformation', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_academic_info WHERE faculty_id = %s', (faculty_id,))
        db_academic_count = cursor.fetchone()[0]
        
        json_academic_count = len([edu for edu in academic_info if edu])
        
        academic_issues = []
        if db_academic_count != json_academic_count:
            academic_issues.append(f"Academic info count mismatch: JSON={json_academic_count}, DB={db_academic_count}")
        
        verification_results['sections']['academic_info'] = {
            'status': 'PASS' if not academic_issues else 'FAIL',
            'issues': academic_issues,
            'json_count': json_academic_count,
            'db_count': db_academic_count
        }
        
        if academic_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(academic_issues)
        
        # 5. Verify Research Guidance
        research_guidance = faculty_data.get('researchGuidance', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_research_guidance WHERE faculty_id = %s', (faculty_id,))
        db_guidance_count = cursor.fetchone()[0]
        
        json_guidance_count = len(research_guidance)
        
        guidance_issues = []
        if db_guidance_count != json_guidance_count:
            guidance_issues.append(f"Research guidance count mismatch: JSON={json_guidance_count}, DB={db_guidance_count}")
        
        verification_results['sections']['research_guidance'] = {
            'status': 'PASS' if not guidance_issues else 'FAIL',
            'issues': guidance_issues,
            'json_count': json_guidance_count,
            'db_count': db_guidance_count
        }
        
        if guidance_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(guidance_issues)
        
        # 6. Verify Funded Projects
        funded_projects = faculty_data.get('fundedProjects', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_funded_projects WHERE faculty_id = %s', (faculty_id,))
        db_projects_count = cursor.fetchone()[0]
        
        json_projects_count = len(funded_projects)
        
        projects_issues = []
        if db_projects_count != json_projects_count:
            projects_issues.append(f"Funded projects count mismatch: JSON={json_projects_count}, DB={db_projects_count}")
        
        verification_results['sections']['funded_projects'] = {
            'status': 'PASS' if not projects_issues else 'FAIL',
            'issues': projects_issues,
            'json_count': json_projects_count,
            'db_count': db_projects_count
        }
        
        if projects_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(projects_issues)
        
        # 7. Verify Awards
        awards = faculty_data.get('awardsAndHonors', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_awards WHERE faculty_id = %s', (faculty_id,))
        db_awards_count = cursor.fetchone()[0]
        
        json_awards_count = len(awards)
        
        awards_issues = []
        if db_awards_count != json_awards_count:
            awards_issues.append(f"Awards count mismatch: JSON={json_awards_count}, DB={db_awards_count}")
        
        verification_results['sections']['awards'] = {
            'status': 'PASS' if not awards_issues else 'FAIL',
            'issues': awards_issues,
            'json_count': json_awards_count,
            'db_count': db_awards_count
        }
        
        if awards_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(awards_issues)
        
        # 8. Verify Memberships
        memberships = faculty_data.get('memberships', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_memberships WHERE faculty_id = %s', (faculty_id,))
        db_memberships_count = cursor.fetchone()[0]
        
        json_memberships_count = len(memberships)
        
        memberships_issues = []
        if db_memberships_count != json_memberships_count:
            memberships_issues.append(f"Memberships count mismatch: JSON={json_memberships_count}, DB={db_memberships_count}")
        
        verification_results['sections']['memberships'] = {
            'status': 'PASS' if not memberships_issues else 'FAIL',
            'issues': memberships_issues,
            'json_count': json_memberships_count,
            'db_count': db_memberships_count
        }
        
        if memberships_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(memberships_issues)
        
        # 9. Verify Professional Services
        professional_services = faculty_data.get('professionalServices', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_professional_services WHERE faculty_id = %s', (faculty_id,))
        db_services_count = cursor.fetchone()[0]
        
        json_services_count = len(professional_services)
        
        services_issues = []
        if db_services_count != json_services_count:
            services_issues.append(f"Professional services count mismatch: JSON={json_services_count}, DB={db_services_count}")
        
        verification_results['sections']['professional_services'] = {
            'status': 'PASS' if not services_issues else 'FAIL',
            'issues': services_issues,
            'json_count': json_services_count,
            'db_count': db_services_count
        }
        
        if services_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(services_issues)
        
        # 10. Verify Courses Attended
        courses_attended = faculty_data.get('coursesAttended', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_courses_attended WHERE faculty_id = %s', (faculty_id,))
        db_attended_count = cursor.fetchone()[0]
        
        json_attended_count = len(courses_attended)
        
        attended_issues = []
        if db_attended_count != json_attended_count:
            attended_issues.append(f"Courses attended count mismatch: JSON={json_attended_count}, DB={db_attended_count}")
        
        verification_results['sections']['courses_attended'] = {
            'status': 'PASS' if not attended_issues else 'FAIL',
            'issues': attended_issues,
            'json_count': json_attended_count,
            'db_count': db_attended_count
        }
        
        if attended_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(attended_issues)
        
        # 11. Verify Courses Conducted
        courses_conducted = faculty_data.get('coursesConducted', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_courses_conducted WHERE faculty_id = %s', (faculty_id,))
        db_conducted_count = cursor.fetchone()[0]
        
        json_conducted_count = len(courses_conducted)
        
        conducted_issues = []
        if db_conducted_count != json_conducted_count:
            conducted_issues.append(f"Courses conducted count mismatch: JSON={json_conducted_count}, DB={db_conducted_count}")
        
        verification_results['sections']['courses_conducted'] = {
            'status': 'PASS' if not conducted_issues else 'FAIL',
            'issues': conducted_issues,
            'json_count': json_conducted_count,
            'db_count': db_conducted_count
        }
        
        if conducted_issues:
            verification_results['perfect_match'] = False
            verification_results['issues'].extend(conducted_issues)
        
        return verification_results, None
        
    except Exception as e:
        return None, f"Error verifying {json_file}: {e}"

def main():
    try:
        print("🔍 COMPREHENSIVE FACULTY VERIFICATION - ALL DEPARTMENTS")
        print("=" * 80)
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        json_files = get_all_json_files()
        print(f"Found {len(json_files)} JSON files across all departments")
        print()
        
        all_results = []
        perfect_faculty = []
        imperfect_faculty = []
        
        for json_file in sorted(json_files):
            dept = os.path.basename(os.path.dirname(json_file)).replace('_json', '').upper()
            print(f"Verifying {dept}: {os.path.basename(json_file)}")
            
            result, error = verify_faculty_comprehensive(cursor, json_file)
            
            if error:
                print(f"  ❌ {error}")
                continue
                
            if result:
                all_results.append(result)
                
                if result['perfect_match']:
                    perfect_faculty.append(result)
                    print(f"  ✅ 100% PERFECT - {result['name']} (ID: {result['faculty_id']})")
                else:
                    imperfect_faculty.append(result)
                    print(f"  ⚠️  ISSUES - {result['name']} (ID: {result['faculty_id']})")
                    for issue in result['issues']:
                        print(f"      - {issue}")
        
        print("\n" + "=" * 80)
        print("📊 FINAL VERIFICATION SUMMARY")
        print("=" * 80)
        
        total_faculty = len(all_results)
        perfect_count = len(perfect_faculty)
        imperfect_count = len(imperfect_faculty)
        
        print(f"Total Faculty Verified: {total_faculty}")
        print(f"Perfect Faculty (100%): {perfect_count} ({perfect_count/total_faculty*100:.1f}%)")
        print(f"Faculty with Issues: {imperfect_count} ({imperfect_count/total_faculty*100:.1f}%)")
        print()
        
        if perfect_faculty:
            print("🎯 FACULTY WITH 100% PERFECT DATA INTEGRITY:")
            dept_groups = {}
            for faculty in perfect_faculty:
                dept = os.path.basename(os.path.dirname([f for f in json_files if os.path.basename(f) == faculty['file']][0])).replace('_json', '').upper()
                if dept not in dept_groups:
                    dept_groups[dept] = []
                dept_groups[dept].append(faculty)
            
            for dept in sorted(dept_groups.keys()):
                print(f"\n{dept} Department ({len(dept_groups[dept])} faculty):")
                for faculty in dept_groups[dept]:
                    print(f"  ✅ {faculty['name']} (ID: {faculty['faculty_id']})")
        
        if imperfect_faculty:
            print(f"\n⚠️  FACULTY REQUIRING ATTENTION ({len(imperfect_faculty)}):")
            for faculty in imperfect_faculty:
                dept = os.path.basename(os.path.dirname([f for f in json_files if os.path.basename(f) == faculty['file']][0])).replace('_json', '').upper()
                print(f"\n{dept} - {faculty['name']} (ID: {faculty['faculty_id']}):")
                for issue in faculty['issues']:
                    print(f"  - {issue}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
