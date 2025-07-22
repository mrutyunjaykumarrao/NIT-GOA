import mysql.connector
import traceback

# Database connection config
DB_CONFIG = {
    'user': 'root',
    'password': 'Mrutyu@2026',
    'host': 'localhost',
    'database': 'nitgoa_db',
    'raise_on_warnings': True
}

def fix_aps_faculty_names():
    """Fix the two APS faculty names to match their JSON files exactly"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🔧 FIXING APS FACULTY NAMES TO MATCH JSON FILES")
        print("=" * 60)
        
        # Fix 1: Update Dr. Gundlapally Shiva Kumar Reddy to Dr. Gundlapally Shiva Kummar Reddy
        print("1. Updating Dr. Gundlapally Shiva Kumar Reddy name...")
        cursor.execute('''
            UPDATE faculty_profiles 
            SET full_name = 'Dr. Gundlapally Shiva Kummar Reddy'
            WHERE full_name = 'Dr. Gundlapally Shiva Kumar Reddy' 
            AND department = 'APS'
        ''')
        
        if cursor.rowcount > 0:
            print("   ✅ Updated: Dr. Gundlapally Shiva Kumar Reddy → Dr. Gundlapally Shiva Kummar Reddy")
        else:
            print("   ⚠️  No update needed for Dr. Gundlapally Shiva Kumar Reddy")
        
        # Fix 2: Update Dr. Lasitha P to Dr. Lasitha P.
        print("\n2. Updating Dr. Lasitha P name...")
        cursor.execute('''
            UPDATE faculty_profiles 
            SET full_name = 'Dr. Lasitha P.'
            WHERE full_name = 'Dr. Lasitha P' 
            AND department = 'APS'
        ''')
        
        if cursor.rowcount > 0:
            print("   ✅ Updated: Dr. Lasitha P → Dr. Lasitha P.")
        else:
            print("   ⚠️  No update needed for Dr. Lasitha P")
        
        conn.commit()
        
        # Verify the changes
        print("\n📊 VERIFICATION - Current APS faculty names:")
        cursor.execute('''
            SELECT id, full_name, email 
            FROM faculty_profiles 
            WHERE department = 'APS' 
            ORDER BY full_name
        ''')
        
        results = cursor.fetchall()
        for row in results:
            print(f"   ID {row[0]}: {row[1]} ({row[2]})")
        
        print(f"\n✅ Successfully updated APS faculty names!")
        print("🎯 Now all APS faculty names should match their JSON files exactly.")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing APS faculty names: {e}")
        traceback.print_exc()
        return False

if __name__ == '__main__':
    fix_aps_faculty_names()
