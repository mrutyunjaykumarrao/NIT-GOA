#!/bin/bash

# =================================================================
# Populate Courses Table from JSON with Department Mapping
# =================================================================

echo "==================================================================="
echo "           Populating Courses from JSON with Department Mapping"
echo "==================================================================="
echo "Database: updated_nitgoa"
echo "Date: $(date)"
echo ""

# Database configuration
DB_NAME="updated_nitgoa"
DB_USER="root"
DB_PASS=""

# Function to execute MySQL commands
execute_mysql() {
    local query="$1"
    mysql -u "$DB_USER" "$DB_NAME" -e "$query"
}

# Function to check if MySQL command was successful
check_mysql_result() {
    if [ $? -ne 0 ]; then
        echo "❌ Error: MySQL command failed"
        exit 1
    fi
}

echo "🔍 Checking current status..."
CURRENT_COURSES=$(execute_mysql "SELECT COUNT(*) FROM courses;" | tail -n 1)
echo "Current courses in database: $CURRENT_COURSES"
echo ""

echo "📊 Department mapping reference:"
execute_mysql "SELECT department_id, department_name FROM departments WHERE department_name LIKE '%Computer%' OR department_name LIKE '%Electronics%' OR department_name LIKE '%Electrical%' OR department_name LIKE '%Mechanical%' OR department_name LIKE '%Civil%';"
echo ""

echo "🔄 Converting JSON data to SQL with department mapping..."

# Create Python script to convert JSON to SQL
cat > /tmp/json_to_sql.py << 'EOF'
import json
import sys

def get_department_id(course_code):
    """Map course code prefix to department ID"""
    if course_code.startswith('CS'):
        return 1  # Computer Science and Engineering
    elif course_code.startswith('EC'):
        return 2  # Electronics and Communication Engineering
    elif course_code.startswith('EE'):
        return 3  # Electrical and Electronics Engineering
    elif course_code.startswith('ME'):
        return 4  # Mechanical Engineering
    elif course_code.startswith('CE') or course_code.startswith('CV'):
        return 5  # Civil Engineering
    else:
        return 'NULL'  # Other departments

def escape_sql_string(s):
    """Escape single quotes in SQL strings"""
    if s is None:
        return ''
    return str(s).replace("'", "''")

def convert_courses_to_sql(courses_data, course_level, used_codes=None):
    """Convert course data to SQL INSERT statements"""
    if used_codes is None:
        used_codes = set()
    
    sql_values = []
    
    for course in courses_data:
        if not isinstance(course, dict):
            continue
            
        course_code = course.get('Course_Code')
        course_name = course.get('Course_Name')
        credits = course.get('Course_Credits', 0)
        semester = course.get('Course_Semester')
        
        # Handle None values and convert to strings
        if course_code is None:
            course_code = ''
        else:
            course_code = str(course_code).strip()
            
        if course_name is None:
            course_name = ''
        else:
            course_name = str(course_name).strip()
            
        if semester is None:
            semester = ''
        else:
            semester = str(semester).strip()
        
        # Skip if essential data is missing
        if not course_code or not course_name:
            continue
        
        # Handle duplicate course codes by adding suffix
        original_code = course_code
        counter = 1
        while course_code in used_codes:
            course_code = f"{original_code}_{counter}"
            counter += 1
        used_codes.add(course_code)
        
        # Get department ID based on original course code (for proper department mapping)
        dept_id = get_department_id(original_code)
        
        # Convert credits to integer, handle None values
        if credits is None:
            credits = 0
        elif isinstance(credits, str):
            try:
                credits = int(credits)
            except:
                credits = 0
        elif not isinstance(credits, int):
            credits = 0
        
        # Create SQL value tuple
        dept_value = str(dept_id) if dept_id != 'NULL' else 'NULL'
        sql_value = f"('{escape_sql_string(course_code)}', '{escape_sql_string(course_name)}', '{course_level}', {dept_value}, {credits}, '{escape_sql_string(semester)}', 1)"
        sql_values.append(sql_value)
    
    return sql_values

try:
    # Load JSON data
    with open('/Users/mrutyunjay/nitgoa/client/src/components/FacultyEditForm/formatted_all_courses.json', 'r') as f:
        data = json.load(f)
    
    # Convert courses
    all_sql_values = []
    used_codes = set()  # Track used course codes across all levels
    
    # Process undergraduate courses
    ug_courses = data.get('undergraduate_courses', [])
    if ug_courses:
        ug_sql = convert_courses_to_sql(ug_courses, 'Undergraduate', used_codes)
        all_sql_values.extend(ug_sql)
        print(f"Converted {len(ug_sql)} undergraduate courses", file=sys.stderr)
    
    # Process postgraduate courses  
    pg_courses = data.get('postgraduate_courses', [])
    if pg_courses:
        pg_sql = convert_courses_to_sql(pg_courses, 'Postgraduate', used_codes)
        all_sql_values.extend(pg_sql)
        print(f"Converted {len(pg_sql)} postgraduate courses", file=sys.stderr)
    
    # Process diploma courses
    diploma_courses = data.get('diploma_courses', [])
    if diploma_courses:
        diploma_sql = convert_courses_to_sql(diploma_courses, 'Diploma', used_codes)
        all_sql_values.extend(diploma_sql)
        print(f"Converted {len(diploma_sql)} diploma courses", file=sys.stderr)
    
    # Process certificate courses
    cert_courses = data.get('certificate_courses', [])
    if cert_courses:
        cert_sql = convert_courses_to_sql(cert_courses, 'Certificate', used_codes)
        all_sql_values.extend(cert_sql)
        print(f"Converted {len(cert_sql)} certificate courses", file=sys.stderr)
    
    print(f"Total courses to insert: {len(all_sql_values)}", file=sys.stderr)
    
    # Generate SQL INSERT statement
    if all_sql_values:
        # Split into chunks to avoid MySQL limits
        chunk_size = 100  # Smaller chunks for reliability
        chunk_count = (len(all_sql_values) + chunk_size - 1) // chunk_size
        print(f"Generating {chunk_count} SQL chunks for {len(all_sql_values)} courses", file=sys.stderr)
        
        for i in range(0, len(all_sql_values), chunk_size):
            chunk = all_sql_values[i:i+chunk_size]
            chunk_num = (i // chunk_size) + 1
            print(f"-- Chunk {chunk_num}/{chunk_count} - Courses {i+1} to {min(i+chunk_size, len(all_sql_values))}")
            sql = "INSERT INTO courses (course_code, course_name, course_level, department_id, credits, semester, is_active) VALUES\n"
            sql += ",\n".join(chunk) + ";"
            print(sql)
            print("")  # Separator between chunks
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
EOF

# Run the Python script to generate SQL
echo "🐍 Running JSON to SQL conversion..."
python3 /tmp/json_to_sql.py > /tmp/courses_insert.sql 2>/tmp/conversion_log.txt

# Check if conversion was successful
if [ $? -ne 0 ]; then
    echo "❌ Error during JSON to SQL conversion:"
    cat /tmp/conversion_log.txt
    exit 1
fi

echo "✅ JSON to SQL conversion completed"
cat /tmp/conversion_log.txt
echo ""

echo "💾 Inserting courses into database..."

# Execute the SQL file with verbose output
echo "Executing SQL file with $(wc -l < /tmp/courses_insert.sql) lines..."
mysql -u "$DB_USER" "$DB_NAME" -v < /tmp/courses_insert.sql

if [ $? -ne 0 ]; then
    echo "❌ Error inserting courses into database"
    echo "Checking what was inserted so far..."
    execute_mysql "SELECT COUNT(*) as partial_count FROM courses;"
    exit 1
fi

echo "✅ Courses inserted successfully"

# Clean up temporary files
rm -f /tmp/json_to_sql.py /tmp/courses_insert.sql /tmp/conversion_log.txt

echo ""
echo "🔍 Verification Results:"

# Get final counts
NEW_COURSES=$(execute_mysql "SELECT COUNT(*) FROM courses;" | tail -n 1)
echo "📊 Total courses in database: $NEW_COURSES"
echo ""

echo "📈 Courses by level:"
execute_mysql "SELECT course_level, COUNT(*) as count FROM courses GROUP BY course_level;"
echo ""

echo "🏛️ Courses by department:"
execute_mysql "
SELECT 
    CASE 
        WHEN d.department_name IS NOT NULL THEN d.department_name
        ELSE 'No Department Assigned'
    END as department,
    COUNT(*) as course_count
FROM courses c
LEFT JOIN departments d ON c.department_id = d.department_id
GROUP BY c.department_id, d.department_name
ORDER BY course_count DESC;"

echo ""
echo "📋 Sample courses with departments:"
execute_mysql "
SELECT 
    c.course_code, 
    c.course_name, 
    c.course_level,
    c.credits,
    c.semester,
    COALESCE(d.department_name, 'No Department') as department
FROM courses c
LEFT JOIN departments d ON c.department_id = d.department_id
ORDER BY c.course_code
LIMIT 15;"

echo ""
echo "🎉 Course population with department mapping completed successfully!"
echo "==================================================================="