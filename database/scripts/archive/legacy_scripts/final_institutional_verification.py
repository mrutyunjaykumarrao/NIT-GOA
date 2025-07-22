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

def final_institutional_verification():
    """Final comprehensive verification of ALL faculty across ALL departments"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🏆 FINAL INSTITUTIONAL FACULTY DATA INTEGRITY VERIFICATION")
        print("=" * 80)
        
        # Department directory mappings
        departments = {
            'CSE': 'cse_json',
            'ECE': 'ece_json', 
            'EEE': 'eee_json',
            'MCE': 'mce_json',
            'CVE': 'cve_json',
            'HSS': 'hss_json',
            'APS': 'aps_json'
        }
        
        all_perfect_faculty = []
        all_faculty_with_issues = []
        dept_summaries = {}
        
        base_dir = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data'
        
        for dept_code, json_dir in departments.items():
            dept_dir = os.path.join(base_dir, json_dir)
            if not os.path.exists(dept_dir):
                continue
                
            json_files = glob(os.path.join(dept_dir, '*.json'))
            dept_perfect = []
            dept_issues = []
            
            print(f"\n🔍 {dept_code} DEPARTMENT VERIFICATION")
            print("-" * 60)
            
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
                        print(f"❌ {faculty_name} - NOT FOUND IN DATABASE")
                        dept_issues.append((faculty_name, 0, ['Not found in database']))
                        continue
                    
                    faculty_id = result[0]
                    issues = []
                    
                    # Quick verification of key sections
                    sections_to_check = [
                        ('publications', ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored'], 'faculty_publications'),
                        ('coursesTaught', None, 'faculty_courses_taught'),
                        ('academicInformation', None, 'faculty_academic_info'),
                        ('researchGuidance', None, 'faculty_research_guidance'),
                        ('fundedProjects', None, 'faculty_funded_projects'),
                        ('awardsAndHonors', None, 'faculty_awards'),
                        ('memberships', None, 'faculty_memberships'),
                        ('professionalServices', None, 'faculty_professional_services'),
                        ('coursesAttended', None, 'faculty_courses_attended'),
                        ('coursesConducted', None, 'faculty_courses_conducted')
                    ]
                    
                    for json_key, sub_keys, table_name in sections_to_check:
                        if json_key == 'publications':
                            json_count = 0
                            pub_data = faculty_data.get(json_key, {})
                            for sub_key in sub_keys:
                                json_count += len(pub_data.get(sub_key, []))
                        elif json_key == 'coursesTaught':
                            courses_data = faculty_data.get(json_key, {})
                            if isinstance(courses_data, dict):
                                json_count = len(courses_data.get('ug', [])) + len(courses_data.get('pg', []))
                            else:
                                json_count = len(courses_data) if courses_data else 0
                        else:
                            data = faculty_data.get(json_key, [])
                            json_count = len(data) if data else 0
                        
                        cursor.execute(f'SELECT COUNT(*) FROM {table_name} WHERE faculty_id = %s', (faculty_id,))
                        db_count = cursor.fetchone()[0]
                        
                        if json_count != db_count:
                            issues.append(f"{json_key}: JSON({json_count}) != DB({db_count})")
                    
                    if not issues:
                        print(f"✅ {faculty_name} (ID: {faculty_id}) - PERFECT")
                        dept_perfect.append((faculty_name, faculty_id))
                        all_perfect_faculty.append((faculty_name, faculty_id, dept_code))
                    else:
                        print(f"❌ {faculty_name} (ID: {faculty_id}) - {len(issues)} issue(s)")
                        dept_issues.append((faculty_name, faculty_id, issues))
                        all_faculty_with_issues.append((faculty_name, faculty_id, dept_code, issues))
                        
                except Exception as e:
                    print(f"Error processing {json_file}: {e}")
                    continue
            
            # Department summary
            total_dept = len(dept_perfect) + len(dept_issues)
            perfect_pct = (len(dept_perfect) / total_dept * 100) if total_dept > 0 else 0
            
            print(f"\n📊 {dept_code} Summary: {len(dept_perfect)}/{total_dept} perfect ({perfect_pct:.1f}%)")
            dept_summaries[dept_code] = {
                'total': total_dept,
                'perfect': len(dept_perfect),
                'issues': len(dept_issues),
                'percentage': perfect_pct
            }
        
        # Final institutional summary
        print(f"\n\n🏆 INSTITUTIONAL SUMMARY - NIT GOA FACULTY DATABASE")
        print("=" * 80)
        
        total_faculty = len(all_perfect_faculty) + len(all_faculty_with_issues)
        total_perfect = len(all_perfect_faculty)
        total_issues = len(all_faculty_with_issues)
        overall_percentage = (total_perfect / total_faculty * 100) if total_faculty > 0 else 0
        
        print(f"📈 OVERALL STATISTICS:")
        print(f"   Total Faculty: {total_faculty}")
        print(f"   Perfect Faculty: {total_perfect} ({overall_percentage:.1f}%)")
        print(f"   Faculty with Issues: {total_issues} ({100-overall_percentage:.1f}%)")
        
        print(f"\n📊 DEPARTMENT BREAKDOWN:")
        for dept, stats in dept_summaries.items():
            status = "🟢 PERFECT" if stats['percentage'] == 100.0 else f"🟡 {stats['percentage']:.1f}%"
            print(f"   {dept}: {stats['perfect']}/{stats['total']} faculty - {status}")
        
        # Count perfect departments
        perfect_depts = [dept for dept, stats in dept_summaries.items() if stats['percentage'] == 100.0]
        print(f"\n🎯 PERFECT DEPARTMENTS: {len(perfect_depts)}/7")
        for dept in perfect_depts:
            print(f"   🟢 {dept} - 100% data integrity")
        
        if all_faculty_with_issues:
            print(f"\n❌ REMAINING ISSUES BY DEPARTMENT:")
            current_dept = None
            for name, fid, dept, issues in sorted(all_faculty_with_issues, key=lambda x: x[2]):
                if dept != current_dept:
                    print(f"\n   ⚠️  {dept} DEPARTMENT:")
                    current_dept = dept
                print(f"      {name} (ID: {fid}) - {len(issues)} issue(s)")
                for issue in issues[:2]:  # Show first 2 issues
                    print(f"         - {issue}")
        
        print(f"\n🎯 FINAL ACHIEVEMENT: {overall_percentage:.1f}% INSTITUTIONAL DATA INTEGRITY")
        
        if overall_percentage >= 95:
            print("🏆 OUTSTANDING ACHIEVEMENT!")
        elif overall_percentage >= 90:
            print("🥇 EXCELLENT ACHIEVEMENT!")
        elif overall_percentage >= 85:
            print("🥈 VERY GOOD ACHIEVEMENT!")
        else:
            print("🥉 GOOD PROGRESS - CONTINUE IMPROVEMENTS!")
        
        cursor.close()
        conn.close()
        
        return dept_summaries, overall_percentage
        
    except Exception as e:
        print(f"Error during institutional verification: {e}")
        traceback.print_exc()
        return {}, 0

if __name__ == '__main__':
    final_institutional_verification()
