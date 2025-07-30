#!/usr/bin/env python3
"""
Simplify Staff Profiles Table Schema

This script removes unnecessary fields from the staff_profiles table since
administrative and technical staff have limited data available.

Fields to remove:
- designation_id (we'll use the role field in employees table)
- qualifications (not available)
- responsibilities (not available)  
- office_location (not available)

Fields to keep:
- employee_id (required)
- department_id (some staff belong to departments)
- specialty (area of work)
- created_at, updated_at (system fields)
"""

import sys
import os
import argparse

def get_db_connection():
    """Get database connection"""
    try:
        import mysql.connector
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='Mrutyu@2026',
            database='updated_nitgoa'
        )
    except ImportError:
        print("Error: mysql-connector-python not installed. Please install it:")
        print("pip install mysql-connector-python")
        sys.exit(1)

def simplify_staff_profiles_table(dry_run=False):
    """Simplify the staff_profiles table by removing unnecessary fields"""
    
    # Get database connection
    connection = get_db_connection()
    
    if not connection:
        print("Error: Could not establish database connection")
        return False
    
    try:
        cursor = connection.cursor()
        
        print("🔧 Simplifying staff_profiles table schema...")
        
        # Check if there's any existing data
        cursor.execute("SELECT COUNT(*) FROM staff_profiles")
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"Warning: Found {existing_count} existing records in staff_profiles table")
            if not dry_run:
                confirm = input("Do you want to proceed? This will remove data in the dropped columns (y/N): ")
                if confirm.lower() != 'y':
                    print("Operation cancelled")
                    return False
        
        # Create backup table
        if not dry_run:
            print("Creating backup of current staff_profiles table...")
            cursor.execute("DROP TABLE IF EXISTS staff_profiles_backup")
            cursor.execute("CREATE TABLE staff_profiles_backup AS SELECT * FROM staff_profiles")
            print("✓ Backup created as staff_profiles_backup")
        
        # Drop unnecessary columns
        columns_to_drop = [
            'designation_id',
            'qualifications', 
            'responsibilities',
            'office_location'
        ]
        
        # First, drop foreign key constraints for columns that have them
        if not dry_run:
            print("Checking and dropping foreign key constraints...")
            
            # Get foreign key constraints
            cursor.execute("""
                SELECT CONSTRAINT_NAME, COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = 'updated_nitgoa' 
                AND TABLE_NAME = 'staff_profiles'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            """)
            
            foreign_keys = cursor.fetchall()
            
            for fk_name, column_name in foreign_keys:
                if column_name in columns_to_drop:
                    print(f"Dropping foreign key constraint: {fk_name} for column {column_name}")
                    cursor.execute(f"ALTER TABLE staff_profiles DROP FOREIGN KEY {fk_name}")
                    print(f"✓ Dropped foreign key {fk_name}")
        
        for column in columns_to_drop:
            # Check if column exists
            cursor.execute("""
                SELECT COUNT(*) 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'updated_nitgoa' 
                AND TABLE_NAME = 'staff_profiles' 
                AND COLUMN_NAME = %s
            """, (column,))
            
            column_exists = cursor.fetchone()[0] > 0
            
            if column_exists:
                if not dry_run:
                    print(f"Dropping column: {column}")
                    cursor.execute(f"ALTER TABLE staff_profiles DROP COLUMN {column}")
                    print(f"✓ Dropped {column}")
                else:
                    print(f"[DRY RUN] Would drop column: {column}")
            else:
                print(f"Column {column} does not exist, skipping")
        
        # Show final table structure
        print("\\nFinal staff_profiles table structure:")
        cursor.execute("DESCRIBE staff_profiles")
        columns = cursor.fetchall()
        
        for col in columns:
            print(f"  {col[0]}: {col[1]} {'NOT NULL' if col[2] == 'NO' else 'NULL'}")
        
        if not dry_run:
            connection.commit()
            print("\\n✅ Staff profiles table simplified successfully")
            print("\\n📋 Simplified fields:")
            print("  - employee_id: Links to employees table")
            print("  - department_id: Department association (optional)")
            print("  - specialty: Area of work/expertise (optional)")
            print("  - created_at, updated_at: System timestamps")
        else:
            print("\\n🔍 DRY RUN completed - No changes made")
            print("Run without --dry-run to apply these changes")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        if not dry_run:
            connection.rollback()
        return False
    finally:
        connection.close()

def main():
    parser = argparse.ArgumentParser(description='Simplify staff_profiles table schema')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be changed without making actual changes')
    
    args = parser.parse_args()
    
    print("🗄️ Staff Profiles Table Simplification")
    print("=" * 50)
    
    if args.dry_run:
        print("🔍 Running in DRY RUN mode - no changes will be made")
    
    success = simplify_staff_profiles_table(dry_run=args.dry_run)
    
    if success:
        print("\\n✅ Script completed successfully")
    else:
        print("\\n❌ Script failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
