#!/usr/bin/env python3
"""
Faculty Database Fix Template

This template provides a standardized approach for creating targeted
database fixes while protecting faculty with 100% data integrity.

Usage:
    1. Copy this template to create a new fix script
    2. Update the FACULTY_TO_FIX list with specific faculty names
    3. Implement the specific fix logic in the fix_faculty_data function
    4. Run the script to apply targeted fixes

Example:
    cp fix_template.py fix_specific_issue.py
    # Edit fix_specific_issue.py with your specific fixes
    python fix_specific_issue.py
"""

import sys
import os
from pathlib import Path

# Add utils to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from db_config import *

# Configure which faculty to fix (add specific names here)
FACULTY_TO_FIX = [
    # "Dr. Faculty Name",
    # "Prof. Another Faculty",
]

# Configure protection (don't modify faculty with 100% integrity)
PROTECTED_FACULTY = [
    # This list should be populated from PROTECTED_FACULTY_RECORDS.md
    # or you can load it dynamically
]

def fix_faculty_data(cursor, faculty_id, faculty_name, json_data):
    """
    Implement your specific fix logic here.
    
    Args:
        cursor: Database cursor
        faculty_id: Faculty ID in database
        faculty_name: Faculty full name
        json_data: Complete faculty JSON data
        
    Returns:
        bool: True if fixes were applied successfully
    """
    try:
        print(f"🔧 Applying fixes for {faculty_name}...")
        
        # Example fix patterns:
        
        # 1. Fix academic information
        # academic_info = json_data.get('academicInformation', [])
        # for edu in academic_info:
        #     cursor.execute('''
        #         INSERT INTO faculty_academic_info (faculty_id, degree, institute, year, subject)
        #         VALUES (%s, %s, %s, %s, %s)
        #         ON DUPLICATE KEY UPDATE institute=%s, year=%s, subject=%s
        #     ''', (faculty_id, edu.get('degree'), edu.get('institute'), 
        #           edu.get('year'), edu.get('subject'),
        #           edu.get('institute'), edu.get('year'), edu.get('subject')))
        
        # 2. Fix publications
        # publications = json_data.get('publications', {})
        # for pub_type, pubs in publications.items():
        #     for pub in pubs:
        #         if pub and pub.strip():
        #             cursor.execute('''
        #                 INSERT INTO faculty_publications (faculty_id, title, publication_type)
        #                 VALUES (%s, %s, %s)
        #             ''', (faculty_id, pub[:500], pub_type))
        
        # 3. Fix name mismatches
        # cursor.execute('''
        #     UPDATE faculty_profiles 
        #     SET full_name = %s
        #     WHERE id = %s
        # ''', (corrected_name, faculty_id))
        
        # 4. Add missing data
        # cursor.execute('''
        #     INSERT INTO faculty_awards (faculty_id, award_title)
        #     VALUES (%s, %s)
        # ''', (faculty_id, award_text))
        
        print(f"✅ Successfully applied fixes for {faculty_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error fixing {faculty_name}: {e}")
        return False

def apply_targeted_fixes():
    """Apply fixes only to specified faculty members"""
    try:
        print_section_header("TARGETED FACULTY DATABASE FIXES")
        
        if not FACULTY_TO_FIX:
            print("⚠️  No faculty specified for fixes. Update FACULTY_TO_FIX list.")
            return False
        
        with DatabaseConnection() as (cursor, conn):
            fixed_count = 0
            
            for faculty_name in FACULTY_TO_FIX:
                # Check if faculty is protected
                if faculty_name in PROTECTED_FACULTY:
                    print(f"🛡️  Skipping {faculty_name} - PROTECTED (100% integrity)")
                    continue
                
                # Get faculty ID
                cursor.execute('SELECT id FROM faculty_profiles WHERE full_name = %s', (faculty_name,))
                result = cursor.fetchone()
                
                if not result:
                    print(f"❌ Faculty not found: {faculty_name}")
                    continue
                
                faculty_id = result[0]
                
                # Load JSON data
                json_data = None
                for dept in get_all_departments():
                    files = get_json_files(dept)
                    for file_path in files:
                        data = load_faculty_json(file_path)
                        if data and data.get('profile', {}).get('name') == faculty_name:
                            json_data = data
                            break
                    if json_data:
                        break
                
                if not json_data:
                    print(f"❌ JSON data not found for {faculty_name}")
                    continue
                
                # Apply fixes
                if fix_faculty_data(cursor, faculty_id, faculty_name, json_data):
                    fixed_count += 1
            
            print(f"\n🎉 Applied fixes to {fixed_count} faculty members")
            return fixed_count > 0
            
    except Exception as e:
        print(f"❌ Error during fixes: {e}")
        return False

def verify_fixes():
    """Run verification after applying fixes"""
    try:
        print("\n" + "="*60)
        print("🔍 VERIFYING FIXES...")
        
        # Import verification script
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'verification'))
        from verify_institutional_data import verify_all_departments
        
        # Run verification
        results = verify_all_departments()
        
        # Check specific faculty that were fixed
        for dept_results in results.values():
            for faculty_result in dept_results.get('results', []):
                if faculty_result['faculty_name'] in FACULTY_TO_FIX:
                    status = "✅ PERFECT" if faculty_result['perfect_match'] else "⚠️  ISSUES"
                    print(f"Fix result for {faculty_result['faculty_name']}: {status}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        return False

def main():
    """Main execution function"""
    print("🔧 FACULTY DATABASE FIX TOOL")
    print("="*50)
    
    if not FACULTY_TO_FIX:
        print("❌ No faculty specified for fixes.")
        print("Please update the FACULTY_TO_FIX list in this script.")
        return 1
    
    print(f"📋 Faculty to fix: {len(FACULTY_TO_FIX)}")
    for name in FACULTY_TO_FIX:
        print(f"   - {name}")
    
    # Apply fixes
    success = apply_targeted_fixes()
    
    if success:
        # Verify fixes
        verify_fixes()
        return 0
    else:
        return 1

if __name__ == '__main__':
    sys.exit(main())
