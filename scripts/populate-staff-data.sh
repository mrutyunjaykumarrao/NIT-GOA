#!/bin/bash

# Script to populate staff data from JSON into employees and staff_profiles tables
# Date: October 3, 2025

set -e

DB_NAME="updated_nitgoa"
JSON_FILE="/Users/mrutyunjay/nitgoa/RefrenceMaterial/staff_master.json"

echo "Starting staff data population from JSON..."
echo "Database: $DB_NAME"
echo "JSON File: $JSON_FILE"
echo "----------------------------------------"

# Create a Python script to parse JSON and generate SQL
cat > /tmp/populate_staff.py << 'EOF'
import json
import sys

# Read the JSON file
with open('/Users/mrutyunjay/nitgoa/RefrenceMaterial/staff_master.json', 'r') as f:
    staff_data = json.load(f)

print("-- Staff Data Population Script")
print("-- Generated on October 3, 2025")
print("USE updated_nitgoa;")
print("")

# Start transaction
print("START TRANSACTION;")
print("")

for staff in staff_data:
    employee_code = staff['employee_code']
    honorific = staff['honorofics'] if staff['honorofics'] != 'NULL' else None
    full_name = staff['full_name'].replace("'", "\\'")
    gender = staff['gender'] if staff['gender'] != 'NULL' else None
    role = staff['role']
    email = staff['email']
    extension_no = staff['extension_no'] if staff['extension_no'] != 'NULL' else None
    
    # Handle department_id - convert "NULL" string to actual NULL
    department_id = staff['department_id'] if staff['department_id'] != 'NULL' else None
    job_title = staff['job_title'].replace("'", "\\'") if staff['job_title'] != 'NULL' else None
    responsibilities = staff['responsibilities'].replace("'", "\\'") if staff['responsibilities'] != 'NULL' else None
    employment_status = staff['employment_status'] if staff['employment_status'] != 'NULL' else None
    image_url = staff['image_url'] if staff['image_url'] != 'NULL' else None
    
    # Insert into employees table
    print(f"-- Inserting {employee_code}: {full_name}")
    print("INSERT INTO employees (")
    print("    employee_code, honorific, full_name, gender, role, email, extension_no,")
    print("    is_active, is_public_visible")
    print(") VALUES (")
    
    # Format values properly
    honorific_val = f"'{honorific}'" if honorific else "NULL"
    full_name_val = f"'{full_name}'"
    gender_val = f"'{gender}'" if gender else "NULL"
    role_val = f"'{role}'"
    email_val = f"'{email}'"
    extension_val = f"'{extension_no}'" if extension_no else "NULL"
    
    print(f"    '{employee_code}', {honorific_val}, {full_name_val}, {gender_val}, {role_val}, {email_val}, {extension_val},")
    print("    1, 1")
    print(");")
    print("")
    
    # Insert into staff_profiles table (only for Administrative and Technical staff)
    if role in ['Administrative', 'Technical']:
        print(f"-- Inserting staff profile for {employee_code}")
        print("INSERT INTO staff_profiles (")
        print("    employee_code, department_id, job_title, responsibilities, employment_status, image_url")
        print(") VALUES (")
        
        department_val = department_id if department_id else "NULL"
        job_title_val = f"'{job_title}'" if job_title else "NULL"
        responsibilities_val = f"'{responsibilities}'" if responsibilities else "NULL"
        employment_status_val = f"'{employment_status}'" if employment_status else "NULL"
        image_url_val = f"'{image_url}'" if image_url else "NULL"
        
        print(f"    '{employee_code}', {department_val}, {job_title_val}, {responsibilities_val}, {employment_status_val}, {image_url_val}")
        print(");")
        print("")

print("COMMIT;")
print("")
print("-- Verify the data")
print("SELECT COUNT(*) as 'Total Staff in employees' FROM employees WHERE role IN ('Administrative', 'Technical');")
print("SELECT COUNT(*) as 'Total Staff profiles' FROM staff_profiles;")
print("SELECT role, COUNT(*) as count FROM employees WHERE role IN ('Administrative', 'Technical') GROUP BY role;")
print("")
print("-- Success! Staff data has been populated.")

EOF

# Run the Python script to generate SQL
echo "Generating SQL from JSON..."
python3 /tmp/populate_staff.py > /tmp/populate_staff.sql

echo "Generated SQL file: /tmp/populate_staff.sql"
echo ""

# Show first few lines of generated SQL
echo "Preview of generated SQL:"
echo "----------------------------------------"
head -20 /tmp/populate_staff.sql
echo "..."
echo "----------------------------------------"
echo ""

# Execute the SQL
echo "Executing SQL to populate database..."
mysql < /tmp/populate_staff.sql

echo ""
echo "✅ Staff data population completed!"
echo ""

# Show final counts
echo "Final verification:"
mysql -e "
USE updated_nitgoa;
SELECT 'Administrative Staff' as Type, COUNT(*) as Count FROM employees WHERE role = 'Administrative'
UNION ALL
SELECT 'Technical Staff' as Type, COUNT(*) as Count FROM employees WHERE role = 'Technical'
UNION ALL
SELECT 'Total Staff Profiles' as Type, COUNT(*) as Count FROM staff_profiles;
"

echo ""
echo "✅ Script completed successfully!"

# Cleanup
rm -f /tmp/populate_staff.py /tmp/populate_staff.sql