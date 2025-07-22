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

# Helper to get all JSON files
def get_json_files():
    return glob(os.path.join(DATA_DIR, '*_json', '*.json'))

def insert_faculty(cursor, faculty, profile):
    try:
        # Map department names to codes
        dept_mapping = {
            'Computer Science': 'CSE',
            'Electronics & Communication': 'ECE', 
            'Electrical & Electronics': 'EEE',
            'Mechanical': 'MCE',
            'Civil': 'CVE',
            'Humanities': 'HSS',
            'Applied Sciences': 'APS'
        }
        
        dept_name = profile.get('department', '')
        dept_code = 'CSE'  # default
        for key, code in dept_mapping.items():
            if key in dept_name:
                dept_code = code
                break
        
        # Parse name into first and last name
        full_name = profile.get('name', '')
        name_parts = full_name.strip().split()
        first_name = name_parts[0] if name_parts else 'Unknown'
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        # Handle missing email by generating one or finding existing faculty
        email = profile.get('email')
        if not email:
            # Try to find existing faculty by name first
            cursor.execute('SELECT id, email FROM faculty_profiles WHERE full_name=%s', (full_name,))
            result = cursor.fetchone()
            if result:
                print(f"Found existing faculty: {full_name}")
                return result[0]
            else:
                # Generate a placeholder email if none exists
                name_for_email = full_name.lower().replace(' ', '.').replace('dr.', '').replace('prof.', '').replace('mr.', '').replace('ms.', '').strip('.')
                email = f"{name_for_email}@nitgoa.ac.in"
        
        # Insert or update faculty_profiles
        cursor.execute('''
            INSERT INTO faculty_profiles (first_name, last_name, full_name, email, phone, mobile, department, designation, research_areas, research_area_summary, address, profile_image, is_hod, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
            ON DUPLICATE KEY UPDATE
                designation=%s,
                phone=%s,
                mobile=%s,
                research_areas=%s,
                research_area_summary=%s,
                address=%s,
                profile_image=%s
        ''', (
            first_name,
            last_name,
            full_name,
            email,
            faculty.get('contactInformation', {}).get('phoneMobile'),
            faculty.get('contactInformation', {}).get('phoneMobile'),
            dept_code,
            profile.get('designation'),
            '; '.join(faculty.get('researchAreas', [])),
            '; '.join(profile.get('researchAreaSummary', [])),
            faculty.get('contactInformation', {}).get('address'),
            profile.get('imageUrl'),
            1 if 'hod' in profile.get('designation', '').lower() else 0,
            # ON DUPLICATE KEY UPDATE values
            profile.get('designation'),
            faculty.get('contactInformation', {}).get('phoneMobile'),
            faculty.get('contactInformation', {}).get('phoneMobile'),
            '; '.join(faculty.get('researchAreas', [])),
            '; '.join(profile.get('researchAreaSummary', [])),
            faculty.get('contactInformation', {}).get('address'),
            profile.get('imageUrl')
        ))
        cursor.execute('SELECT id FROM faculty_profiles WHERE email=%s', (email,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            # If not found by email, try by name
            cursor.execute('SELECT id FROM faculty_profiles WHERE full_name=%s', (full_name,))
            result = cursor.fetchone()
            return result[0] if result else None
    except Exception as e:
        print(f"Error inserting faculty {profile.get('name')}: {e}")
        return None

def insert_academic_info(cursor, faculty_id, academic_info):
    if not faculty_id or not academic_info:
        return
    
    # Track unique academic info to avoid duplicates
    seen_academic = set()
    
    for edu in academic_info:
        try:
            if not edu:  # Skip None or empty entries
                continue
                
            # Handle None values safely
            degree = edu.get('degree', '') if edu.get('degree') is not None else ''
            institute = edu.get('institute', '') if edu.get('institute') is not None else ''
            year = edu.get('year', '') if edu.get('year') is not None else ''
            subject = edu.get('subject', '') if edu.get('subject') is not None else ''
            
            # Clean the strings
            degree = degree.strip()
            institute = institute.strip()
            year = year.strip()
            subject = subject.strip()
            
            # Skip if all fields are empty
            if not any([degree, institute, year, subject]):
                continue
            
            # Create a unique key for this academic info
            academic_key = (faculty_id, degree, institute, year, subject)
            
            # Skip if we've already seen this exact academic info for this faculty
            if academic_key in seen_academic:
                print(f"Skipping duplicate academic info: {degree} from {institute}")
                continue
                
            seen_academic.add(academic_key)
            
            cursor.execute('''
                INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE institute=%s, year=%s, subject=%s
            ''', (
                faculty_id, 
                degree, 
                institute, 
                year, 
                subject,
                # ON DUPLICATE KEY UPDATE values
                institute,
                year,
                subject
            ))
        except Exception as e:
            print(f"Error inserting academic info for faculty {faculty_id}: {e}")

def insert_publications(cursor, faculty_id, publications):
    if not faculty_id or not publications:
        return
    
    # Track unique publications to avoid duplicates within the same faculty
    seen_publications = set()
    
    for pub_type in ['journal', 'conference', 'proceedings', 'bookChapters', 'booksAuthored']:
        for pub in publications.get(pub_type, []):
            try:
                # Clean and normalize the publication title
                pub_clean = pub.strip()
                if not pub_clean:
                    continue
                    
                ptype = 'journal' if pub_type == 'journal' else \
                        'conference' if pub_type == 'conference' else \
                        'proceedings' if pub_type == 'proceedings' else \
                        'chapter' if pub_type == 'bookChapters' else \
                        'book' if pub_type == 'booksAuthored' else 'other'
                
                # Create a unique key for this publication
                pub_key = (faculty_id, pub_clean[:500], ptype)
                
                # Skip if we've already seen this exact publication for this faculty
                if pub_key in seen_publications:
                    print(f"Skipping duplicate publication: {pub_clean[:50]}...")
                    continue
                
                seen_publications.add(pub_key)
                
                cursor.execute('''
                    INSERT INTO faculty_publications (faculty_id, title, publication_type)
                    VALUES (%s, %s, %s) AS new_pub
                    ON DUPLICATE KEY UPDATE 
                    title = new_pub.title,
                    publication_type = new_pub.publication_type
                ''', (faculty_id, pub_clean[:500], ptype))  # Limit title length
            except Exception as e:
                print(f"Error inserting publication for faculty {faculty_id}: {e}")

def insert_research_guidance(cursor, faculty_id, guidance):
    if not faculty_id or not guidance:
        return
    for entry in guidance:
        try:
            cursor.execute('''
                INSERT INTO faculty_research_guidance (faculty_id, student_name, guidance_type, status)
                VALUES (%s, %s, %s, %s)
            ''', (faculty_id, entry[:200], 'phd', 'completed' if 'AWARDED' in entry else 'submitted'))
        except Exception as e:
            print(f"Error inserting research guidance for faculty {faculty_id}: {e}")

def insert_funded_projects(cursor, faculty_id, projects):
    if not faculty_id or not projects:
        return
    for proj in projects:
        try:
            cursor.execute('''
                INSERT INTO faculty_funded_projects (faculty_id, project_title)
                VALUES (%s, %s)
            ''', (faculty_id, proj[:500]))
        except Exception as e:
            print(f"Error inserting funded project for faculty {faculty_id}: {e}")

def insert_awards(cursor, faculty_id, awards):
    if not faculty_id or not awards:
        return
    for award in awards:
        try:
            cursor.execute('''
                INSERT INTO faculty_awards (faculty_id, award_title)
                VALUES (%s, %s)
            ''', (faculty_id, award[:500]))
        except Exception as e:
            print(f"Error inserting award for faculty {faculty_id}: {e}")

def insert_memberships(cursor, faculty_id, memberships):
    if not faculty_id or not memberships:
        return
    
    # Track unique memberships to avoid duplicates
    seen_memberships = set()
    
    for membership in memberships:
        try:
            membership_text = membership if isinstance(membership, str) else membership.get('info', '')
            membership_text = membership_text.strip()[:300]
            
            if not membership_text:
                continue
                
            # Create a unique key for this membership
            membership_key = (faculty_id, membership_text)
            
            # Skip if we've already seen this exact membership for this faculty
            if membership_key in seen_memberships:
                print(f"Skipping duplicate membership: {membership_text[:50]}...")
                continue
                
            seen_memberships.add(membership_key)
            
            cursor.execute('''
                INSERT INTO faculty_memberships (faculty_id, organization_name)
                VALUES (%s, %s)
            ''', (faculty_id, membership_text))
        except Exception as e:
            print(f"Error inserting membership for faculty {faculty_id}: {e}")

def insert_professional_services(cursor, faculty_id, services):
    if not faculty_id or not services:
        return
    for service in services:
        try:
            service_text = service if isinstance(service, str) else service.get('info', '')
            cursor.execute('''
                INSERT INTO faculty_professional_services (faculty_id, service_type, description)
                VALUES (%s, 'other', %s)
            ''', (faculty_id, service_text[:500]))
        except Exception as e:
            print(f"Error inserting professional service for faculty {faculty_id}: {e}")

def insert_courses_taught(cursor, faculty_id, courses, course_level):
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

def insert_courses(cursor, faculty_id, courses, table):
    if not faculty_id or not courses:
        return
    for course in courses:
        try:
            course_text = course if isinstance(course, str) else course.get('info', '')
            cursor.execute(f'''
                INSERT INTO {table} (faculty_id, course_title)
                VALUES (%s, %s) AS new_course
                ON DUPLICATE KEY UPDATE course_title = new_course.course_title
            ''', (faculty_id, course_text[:500]))
        except Exception as e:
            print(f"Error inserting course for faculty {faculty_id} in table {table}: {e}")

def main():
    try:
        print("Connecting to database...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Getting JSON files...")
        files = get_json_files()
        print(f"Found {len(files)} JSON files to process")
        
        processed = 0
        for fpath in files:
            try:
                print(f"Processing: {os.path.basename(fpath)}")
                with open(fpath, 'r', encoding='utf-8') as f:
                    faculty = json.load(f)
                
                profile = faculty.get('profile', {})
                if not profile.get('name'):
                    print(f"Skipping {fpath} - missing name")
                    continue
                    
                faculty_id = insert_faculty(cursor, faculty, profile)
                if not faculty_id:
                    print(f"Could not insert/find faculty for {profile.get('name')}")
                    continue
                    
                # Insert all related data
                insert_academic_info(cursor, faculty_id, faculty.get('academicInformation', []))
                insert_publications(cursor, faculty_id, faculty.get('publications', {}))
                insert_research_guidance(cursor, faculty_id, faculty.get('researchGuidance', []))
                insert_funded_projects(cursor, faculty_id, faculty.get('fundedProjects', []))
                insert_awards(cursor, faculty_id, faculty.get('awardsAndHonors', []))
                insert_memberships(cursor, faculty_id, faculty.get('memberships', []))
                insert_professional_services(cursor, faculty_id, faculty.get('professionalServices', []))
                
                # Insert courses
                courses_taught = faculty.get('coursesTaught', {})
                if isinstance(courses_taught, dict):
                    insert_courses_taught(cursor, faculty_id, courses_taught.get('ug', []), 'ug')
                    insert_courses_taught(cursor, faculty_id, courses_taught.get('pg', []), 'pg')
                else:
                    insert_courses_taught(cursor, faculty_id, courses_taught, 'ug')
                    
                insert_courses(cursor, faculty_id, faculty.get('coursesAttended', []), 'faculty_courses_attended')
                insert_courses(cursor, faculty_id, faculty.get('coursesConducted', []), 'faculty_courses_conducted')
                
                conn.commit()
                processed += 1
                print(f"Successfully processed {profile.get('name')} ({processed}/{len(files)})")
                
            except Exception as e:
                print(f"Error processing file {fpath}: {e}")
                traceback.print_exc()
                conn.rollback()
                continue
        
        print(f"\nCompleted! Processed {processed} out of {len(files)} faculty files.")
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Database connection error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
