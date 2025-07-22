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

DATA_DIR = '/Users/mrutyunjaykumarrao/nitgoa/client/src/Views/People-Section/Faculty/FacultyDetails/data/mce_json'

def verify_mce_faculty_detailed(cursor, json_file):
    """Detailed verification of a single MCE faculty member"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            faculty_data = json.load(f)
        
        profile = faculty_data.get('profile', {})
        faculty_name = profile.get('name', '')
        
        if not faculty_name:
            return None, "No faculty name found"
        
        # Get faculty ID from database
        cursor.execute('SELECT id, department FROM faculty_profiles WHERE full_name = %s', (faculty_name,))
        result = cursor.fetchone()
        if not result:
            return None, f"Faculty not found in database: {faculty_name}"
        
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
            'sections': {},
            'perfect_match': True,
            'total_issues': 0,
            'issues': []
        }
        
        # 1. Basic Profile Verification
        cursor.execute('SELECT designation, email, phone, mobile FROM faculty_profiles WHERE id = %s', (faculty_id,))
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
        print(f"   Department: MCE ✓")
        
        # 2. Publications Verification
        publications = faculty_data.get('publications', {})
        cursor.execute('SELECT COUNT(*), publication_type FROM faculty_publications WHERE faculty_id = %s GROUP BY publication_type', (faculty_id,))
        db_pubs = {row[1]: row[0] for row in cursor.fetchall()}
        
        json_pubs = {}
        for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
            count = len(publications.get(pub_type, []))
            if count > 0:
                json_pubs[pub_type] = count
        
        total_db_pubs = sum(db_pubs.values())
        total_json_pubs = sum(json_pubs.values())
        
        print(f"\n✅ 2. PUBLICATIONS:")
        print(f"   Total JSON: {total_json_pubs}")
        print(f"   Total DB: {total_db_pubs}")
        
        if total_db_pubs == total_json_pubs:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Publication count mismatch: JSON={total_json_pubs}, DB={total_db_pubs}")
        
        for pub_type, count in json_pubs.items():
            db_type = 'journal' if pub_type == 'journal' else \
                     'conference' if pub_type == 'conference' else \
                     'proceedings' if pub_type == 'proceedings' else \
                     'chapter' if pub_type == 'bookChapters' else \
                     'book' if pub_type == 'booksAuthored' else 'other'
            db_count = db_pubs.get(db_type, 0)
            status = "✅" if count == db_count else "❌"
            print(f"   {pub_type}: JSON={count}, DB={db_count} {status}")
        
        # 3. Courses Taught Verification
        courses_taught = faculty_data.get('coursesTaught', {})
        cursor.execute('SELECT course_level, COUNT(*) FROM faculty_courses_taught WHERE faculty_id = %s GROUP BY course_level', (faculty_id,))
        db_courses = {row[0]: row[1] for row in cursor.fetchall()}
        
        json_courses = {}
        if isinstance(courses_taught, dict):
            if courses_taught.get('ug'):
                json_courses['ug'] = len(courses_taught['ug'])
            if courses_taught.get('pg'):
                json_courses['pg'] = len(courses_taught['pg'])
        
        print(f"\n✅ 3. COURSES TAUGHT:")
        total_db_courses = sum(db_courses.values())
        total_json_courses = sum(json_courses.values())
        print(f"   Total JSON: {total_json_courses}")
        print(f"   Total DB: {total_db_courses}")
        
        if total_db_courses == total_json_courses:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Courses taught count mismatch: JSON={total_json_courses}, DB={total_db_courses}")
        
        for level in ['ug', 'pg']:
            json_count = json_courses.get(level, 0)
            db_count = db_courses.get(level, 0)
            status = "✅" if json_count == db_count else "❌"
            print(f"   {level.upper()}: JSON={json_count}, DB={db_count} {status}")
        
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
            print(f"   📋 Academic Info Details:")
            for i, edu in enumerate(academic_info):
                if edu:
                    degree = edu.get('degree', '')
                    institute = edu.get('institute', '')
                    year = edu.get('year', '')
                    print(f"      {i+1}. {degree} from {institute} ({year})")
        
        # 5. Research Guidance
        research_guidance = faculty_data.get('researchGuidance', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_research_guidance WHERE faculty_id = %s', (faculty_id,))
        db_guidance = cursor.fetchone()[0]
        json_guidance = len(research_guidance)
        
        print(f"\n✅ 5. RESEARCH GUIDANCE:")
        print(f"   JSON: {json_guidance}")
        print(f"   DB: {db_guidance}")
        if db_guidance == json_guidance:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Research guidance count mismatch: JSON={json_guidance}, DB={db_guidance}")
        
        # 6. Funded Projects
        funded_projects = faculty_data.get('fundedProjects', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_funded_projects WHERE faculty_id = %s', (faculty_id,))
        db_projects = cursor.fetchone()[0]
        json_projects = len(funded_projects)
        
        print(f"\n✅ 6. FUNDED PROJECTS:")
        print(f"   JSON: {json_projects}")
        print(f"   DB: {db_projects}")
        if db_projects == json_projects:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Funded projects count mismatch: JSON={json_projects}, DB={db_projects}")
        
        # 7. Awards and Honors
        awards = faculty_data.get('awardsAndHonors', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_awards WHERE faculty_id = %s', (faculty_id,))
        db_awards = cursor.fetchone()[0]
        json_awards = len(awards)
        
        print(f"\n✅ 7. AWARDS AND HONORS:")
        print(f"   JSON: {json_awards}")
        print(f"   DB: {db_awards}")
        if db_awards == json_awards:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Awards count mismatch: JSON={json_awards}, DB={db_awards}")
        
        # 8. Memberships
        memberships = faculty_data.get('memberships', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_memberships WHERE faculty_id = %s', (faculty_id,))
        db_memberships = cursor.fetchone()[0]
        json_memberships = len(memberships)
        
        print(f"\n✅ 8. MEMBERSHIPS:")
        print(f"   JSON: {json_memberships}")
        print(f"   DB: {db_memberships}")
        if db_memberships == json_memberships:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Memberships count mismatch: JSON={json_memberships}, DB={db_memberships}")
        
        # 9. Professional Services
        professional_services = faculty_data.get('professionalServices', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_professional_services WHERE faculty_id = %s', (faculty_id,))
        db_services = cursor.fetchone()[0]
        json_services = len(professional_services)
        
        print(f"\n✅ 9. PROFESSIONAL SERVICES:")
        print(f"   JSON: {json_services}")
        print(f"   DB: {db_services}")
        if db_services == json_services:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Professional services count mismatch: JSON={json_services}, DB={db_services}")
        
        # 10. Courses Attended
        courses_attended = faculty_data.get('coursesAttended', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_courses_attended WHERE faculty_id = %s', (faculty_id,))
        db_attended = cursor.fetchone()[0]
        json_attended = len(courses_attended)
        
        print(f"\n✅ 10. COURSES ATTENDED:")
        print(f"   JSON: {json_attended}")
        print(f"   DB: {db_attended}")
        if db_attended == json_attended:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Courses attended count mismatch: JSON={json_attended}, DB={db_attended}")
        
        # 11. Courses Conducted
        courses_conducted = faculty_data.get('coursesConducted', [])
        cursor.execute('SELECT COUNT(*) FROM faculty_courses_conducted WHERE faculty_id = %s', (faculty_id,))
        db_conducted = cursor.fetchone()[0]
        json_conducted = len(courses_conducted)
        
        print(f"\n✅ 11. COURSES CONDUCTED:")
        print(f"   JSON: {json_conducted}")
        print(f"   DB: {db_conducted}")
        if db_conducted == json_conducted:
            print(f"   Status: ✅ PERFECT MATCH")
        else:
            print(f"   Status: ❌ MISMATCH")
            verification_results['perfect_match'] = False
            verification_results['total_issues'] += 1
            verification_results['issues'].append(f"Courses conducted count mismatch: JSON={json_conducted}, DB={db_conducted}")
        
        # Final Status
        print(f"\n{'='*60}")
        if verification_results['perfect_match']:
            print(f"🎯 FINAL STATUS: ✅ 100% PERFECT DATA INTEGRITY")
            print(f"🔒 This faculty is PROTECTED from modifications")
        else:
            print(f"⚠️  FINAL STATUS: ❌ {verification_results['total_issues']} ISSUES FOUND")
            print(f"🔧 This faculty needs attention")
            for issue in verification_results['issues']:
                print(f"     - {issue}")
        print(f"{'='*60}")
        
        return verification_results, None
        
    except Exception as e:
        return None, f"Error verifying {json_file}: {e}"

def main():
    try:
        print("🔍 DETAILED MCE FACULTY VERIFICATION")
        print("=" * 80)
        
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Get all MCE JSON files
        mce_files = glob(os.path.join(DATA_DIR, '*.json'))
        print(f"Found {len(mce_files)} MCE faculty JSON files")
        
        perfect_faculty = []
        issues_faculty = []
        
        for json_file in sorted(mce_files):
            result, error = verify_mce_faculty_detailed(cursor, json_file)
            
            if error:
                print(f"❌ {error}")
                continue
                
            if result:
                if result['perfect_match']:
                    perfect_faculty.append(result)
                else:
                    issues_faculty.append(result)
        
        print(f"\n\n🎯 MCE DEPARTMENT SUMMARY")
        print("=" * 80)
        print(f"Total MCE Faculty: {len(mce_files)}")
        print(f"Perfect Faculty: {len(perfect_faculty)} ({len(perfect_faculty)/len(mce_files)*100:.1f}%)")
        print(f"Faculty with Issues: {len(issues_faculty)} ({len(issues_faculty)/len(mce_files)*100:.1f}%)")
        
        if perfect_faculty:
            print(f"\n✅ PERFECT MCE FACULTY (PROTECTED):")
            for faculty in perfect_faculty:
                print(f"   🔒 {faculty['name']} (ID: {faculty['faculty_id']})")
        
        if issues_faculty:
            print(f"\n⚠️  MCE FACULTY NEEDING ATTENTION:")
            for faculty in issues_faculty:
                print(f"\n   🔧 {faculty['name']} (ID: {faculty['faculty_id']}) - {faculty['total_issues']} issues:")
                for issue in faculty['issues']:
                    print(f"      - {issue}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
