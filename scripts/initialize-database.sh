#!/bin/bash
# =================================================================
# NIT GOA Database Initialization System
# Creates database, schema, and populates initial data
# =================================================================

# Set script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables from server/.env
ENV_FILE="$PROJECT_ROOT/server/.env"
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "❌ Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Database configuration
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-updated_nitgoa}
DB_PORT=${DB_PORT:-3306}

# File paths
SCHEMA_FILE="$PROJECT_ROOT/database/schemas/corrected_nitgoa_schema.sql"
FACULTY_JSON="$PROJECT_ROOT/RefrenceMaterial/faculty.json"
BACKUP_DIR="$PROJECT_ROOT/database/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}           NIT GOA Database Initialization System${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo ""

# Function to test database connection
test_db_connection() {
    echo -e "${YELLOW}🔍 Testing database connection...${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1;" >/dev/null 2>&1
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" >/dev/null 2>&1
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        echo -e "   Please check your database server and credentials in server/.env"
        return 1
    fi
}

# Function to check if database exists
check_database_exists() {
    local db_exists
    if [ -z "$DB_PASSWORD" ]; then
        db_exists=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$DB_NAME';" 2>/dev/null | grep -c "$DB_NAME")
    else
        db_exists=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$DB_NAME';" 2>/dev/null | grep -c "$DB_NAME")
    fi
    
    [ "$db_exists" -gt 0 ]
}

# Function to create database
create_database() {
    echo -e "${YELLOW}🏗️  Creating database '$DB_NAME'...${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to create database '$DB_NAME'${NC}"
        return 1
    fi
}

# Function to drop existing database
drop_database() {
    echo -e "${YELLOW}🗑️  Dropping existing database '$DB_NAME'...${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "DROP DATABASE $DB_NAME;" 2>/dev/null
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "DROP DATABASE $DB_NAME;" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database '$DB_NAME' dropped successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to drop database '$DB_NAME'${NC}"
        return 1
    fi
}

# Function to import schema
import_schema() {
    echo -e "${YELLOW}📋 Importing database schema...${NC}"
    
    if [ ! -f "$SCHEMA_FILE" ]; then
        echo -e "${RED}❌ Schema file not found: $SCHEMA_FILE${NC}"
        return 1
    fi
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$SCHEMA_FILE" 2>/dev/null
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SCHEMA_FILE" 2>/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema imported successfully${NC}"
        
        # Get table count
        local table_count
        if [ -z "$DB_PASSWORD" ]; then
            table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        else
            table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        fi
        
        echo -e "   Tables created: $table_count"
        return 0
    else
        echo -e "${RED}❌ Failed to import schema${NC}"
        return 1
    fi
}

# Function to check if Node.js is available
check_nodejs() {
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
        return 0
    else
        echo -e "${RED}❌ Node.js not found${NC}"
        echo -e "   Please install Node.js to populate faculty data"
        return 1
    fi
}

# Function to create data import script
create_data_import_script() {
    local import_script="$PROJECT_ROOT/scripts/import-faculty-data.js"
    
    cat > "$import_script" << 'EOF'
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'updated_nitgoa',
    port: process.env.DB_PORT || 3306
};

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function importFacultyData() {
    let connection;
    
    try {
        console.log(`${colors.blue}==================================================================`);
        console.log(`           NIT GOA Faculty Data Import`);
        console.log(`==================================================================${colors.reset}\n`);
        
        // Read faculty JSON file
        const facultyJsonPath = path.join(__dirname, '../RefrenceMaterial/faculty.json');
        console.log(`${colors.yellow}📖 Reading faculty data from: ${path.basename(facultyJsonPath)}${colors.reset}`);
        
        if (!fs.existsSync(facultyJsonPath)) {
            throw new Error(`Faculty JSON file not found: ${facultyJsonPath}`);
        }
        
        const facultyData = JSON.parse(fs.readFileSync(facultyJsonPath, 'utf8'));
        console.log(`${colors.green}✅ Found ${facultyData.faculty.length} faculty records${colors.reset}\n`);
        
        // Connect to database
        console.log(`${colors.yellow}🔌 Connecting to database...${colors.reset}`);
        connection = await mysql.createConnection(dbConfig);
        console.log(`${colors.green}✅ Connected to database: ${dbConfig.database}${colors.reset}\n`);
        
        // Check if data already exists
        const [existingRecords] = await connection.execute('SELECT COUNT(*) as count FROM faculty_profiles');
        const existingCount = existingRecords[0].count;
        
        if (existingCount > 0) {
            console.log(`${colors.yellow}⚠️  Found ${existingCount} existing faculty records${colors.reset}`);
            console.log(`${colors.yellow}   Clearing existing data...${colors.reset}`);
            
            // Clear existing data (faculty_profiles first due to foreign key)
            await connection.execute('DELETE FROM faculty_profiles');
            await connection.execute('DELETE FROM employees WHERE role = "Faculty"');
            console.log(`${colors.green}✅ Existing data cleared${colors.reset}\n`);
        }
        
        // Step 1: Create reference data for departments and designations
        console.log(`${colors.yellow}📋 Creating reference data...${colors.reset}`);
        
        // Clear existing reference data
        await connection.execute('DELETE FROM faculty_designations');
        await connection.execute('DELETE FROM departments');
        
        // Populate departments from departments.json
        const departmentsJsonPath = path.join(__dirname, '../RefrenceMaterial/collaborators/MJ 2/updated_database/departments.json');
        let departmentData = {};
        
        if (fs.existsSync(departmentsJsonPath)) {
            departmentData = JSON.parse(fs.readFileSync(departmentsJsonPath, 'utf8'));
            console.log(`   Found departments file with ${Object.keys(departmentData).length} departments`);
            
            let deptId = 1;
            for (const [fullName, code] of Object.entries(departmentData)) {
                await connection.execute(
                    'INSERT INTO departments (department_id, department_name, department_code, is_active) VALUES (?, ?, ?, 1)',
                    [deptId, fullName, code]
                );
                deptId++;
            }
        } else {
            console.log(`   ${colors.yellow}Departments file not found, creating from faculty data${colors.reset}`);
            // Extract unique departments from faculty data
            const departments = [...new Set(facultyData.faculty.map(f => f.department_id))];
            const departmentNames = {
                1: 'Department of Computer Science and Engineering',
                2: 'Department of Electronics and Communication Engineering', 
                3: 'Department of Electrical and Electronics Engineering',
                4: 'Department of Mechanical Engineering',
                5: 'Department of Civil Engineering',
                6: 'Department of Applied Sciences',
                7: 'Department of Humanities and Social Sciences'
            };
            
            for (const deptId of departments) {
                if (deptId && departmentNames[deptId]) {
                    await connection.execute(
                        'INSERT INTO departments (department_id, department_name, department_code, is_active) VALUES (?, ?, ?, 1)',
                        [deptId, departmentNames[deptId], `DEPT${deptId}`]
                    );
                }
            }
        }
        
        // Extract unique designations from faculty data and populate faculty_designations
        const designationMap = {};
        facultyData.faculty.forEach(faculty => {
            if (faculty.designation_id && faculty.role) {
                designationMap[faculty.designation_id] = faculty.role;
            }
        });
        
        console.log(`   Found ${Object.keys(designationMap).length} unique designations`);
        
        for (const [designationId, designationTitle] of Object.entries(designationMap)) {
            await connection.execute(
                'INSERT INTO faculty_designations (designation_id, designation_title, is_active) VALUES (?, ?, 1)',
                [parseInt(designationId), designationTitle]
            );
        }
        
        console.log(`${colors.green}✅ Reference data created successfully${colors.reset}`);
        
        // Step 2: Clear existing employee and faculty data
        console.log(`${colors.yellow}🧹 Clearing existing data...${colors.reset}`);
        await connection.execute('DELETE FROM faculty_profiles');
        await connection.execute('DELETE FROM employees');
        
        // Step 3: Import employees data first
        console.log(`${colors.yellow}👥 Importing employees data...${colors.reset}`);
        
        const employeeInsertQuery = `
            INSERT INTO employees (
                employee_code, full_name, honorific, email, phone_mobile, extension_no,
                date_of_joining, date_of_leaving, role, job_title, is_hod, department_id,
                designation_id, employment_status, employment_type, image_url, is_active,
                is_public_visible, display_order, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        let employeeSuccessCount = 0;
        let employeeErrorCount = 0;
        
        for (const faculty of facultyData.faculty) {
            try {
                const employeeValues = [
                    faculty.employee_code,
                    faculty.full_name,
                    faculty.honorific || null,
                    faculty.email,
                    faculty.phone_mobile || null,
                    faculty.extension_no || null,
                    faculty.date_of_joining || null,
                    faculty.date_of_leaving || null,
                    'Faculty', // All are faculty
                    faculty.role, // job_title is the role/designation
                    faculty.is_hod ? 1 : 0,
                    faculty.department_id || null,
                    faculty.designation_id || null,
                    faculty.employment_status || 'Active',
                    faculty.employment_type || 'Full-time',
                    faculty.image_url || null,
                    1, // is_active
                    1, // is_public_visible  
                    faculty.display_order || 0
                ];
                
                await connection.execute(employeeInsertQuery, employeeValues);
                employeeSuccessCount++;
                
                if (employeeSuccessCount % 10 === 0) {
                    console.log(`   Imported ${employeeSuccessCount}/${facultyData.faculty.length} employee records...`);
                }
            } catch (error) {
                employeeErrorCount++;
                console.error(`${colors.red}❌ Error importing employee: ${faculty.full_name || 'Unknown'}${colors.reset}`);
                console.error(`   Error: ${error.message}`);
            }
        }
        
        console.log(`${colors.green}✅ Employees data imported: ${employeeSuccessCount} success, ${employeeErrorCount} errors${colors.reset}`);
        
        // Step 4: Import faculty profiles data
        console.log(`${colors.yellow}🎓 Importing faculty profiles data...${colors.reset}`);
        
        const facultyProfileInsertQuery = `
            INSERT INTO faculty_profiles (
                employee_code, gender, date_of_birth, research_teaching_experience, address,
                office_location, office_hours, linkedin_url, personal_website_url,
                google_scholar_url, orcid_id, scopus_id, research_gate_url, other_social_links,
                bio_summary, research_interests, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        let facultySuccessCount = 0;
        let facultyErrorCount = 0;
        
        for (const faculty of facultyData.faculty) {
            try {
                const facultyValues = [
                    faculty.employee_code,
                    faculty.gender || null,
                    faculty.date_of_birth || null,
                    faculty.research_teaching_experience || null,
                    faculty.address || null,
                    faculty.office_location || null,
                    faculty.office_hours || null,
                    faculty.linkedin_url || null,
                    faculty.personal_website_url || null,
                    faculty.google_scholar_url || null,
                    faculty.orcid_id || null,
                    faculty.scopus_id || null,
                    faculty.research_gate_url || null,
                    faculty.other_social_links ? JSON.stringify(faculty.other_social_links) : null,
                    faculty.bio_summary || null,
                    faculty.research_interests ? JSON.stringify(faculty.research_interests) : null
                ];
                
                await connection.execute(facultyProfileInsertQuery, facultyValues);
                facultySuccessCount++;
                
                if (facultySuccessCount % 10 === 0) {
                    console.log(`   Imported ${facultySuccessCount}/${facultyData.faculty.length} faculty profile records...`);
                }
            } catch (error) {
                facultyErrorCount++;
                console.error(`${colors.red}❌ Error importing faculty profile: ${faculty.full_name || 'Unknown'}${colors.reset}`);
                console.error(`   Error: ${error.message}`);
            }
        }
        
        console.log(`\n${colors.green}✅ Faculty data import completed${colors.reset}`);
        console.log(`   Employees imported: ${employeeSuccessCount} success, ${employeeErrorCount} errors`);
        console.log(`   Faculty profiles imported: ${facultySuccessCount} success, ${facultyErrorCount} errors`);
        
        // Verify import
        const [deptCount] = await connection.execute('SELECT COUNT(*) as count FROM departments');
        const [designationCount] = await connection.execute('SELECT COUNT(*) as count FROM faculty_designations');
        const [employeeCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
        const [facultyCount] = await connection.execute('SELECT COUNT(*) as count FROM faculty_profiles');
        
        console.log(`   Final counts:`);
        console.log(`     Departments: ${deptCount[0].count}`);
        console.log(`     Designations: ${designationCount[0].count}`);
        console.log(`     Employees: ${employeeCount[0].count}`);
        console.log(`     Faculty Profiles: ${facultyCount[0].count}`);
        
    } catch (error) {
        console.error(`${colors.red}❌ Import failed: ${error.message}${colors.reset}`);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the import
importFacultyData();
EOF
    
    echo "$import_script"
}

# Function to install Node.js dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    
    cd "$PROJECT_ROOT/server" || return 1
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found in server directory${NC}"
        return 1
    fi
    
    # Install dependencies
    npm install >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        return 1
    fi
}

# Function to populate faculty data
populate_faculty_data() {
    echo -e "${YELLOW}👥 Populating faculty data...${NC}"
    
    if [ ! -f "$FACULTY_JSON" ]; then
        echo -e "${YELLOW}⚠️  Faculty JSON file not found: $FACULTY_JSON${NC}"
        echo -e "   Skipping faculty data import"
        return 0
    fi
    
    if ! check_nodejs; then
        echo -e "${YELLOW}⚠️  Skipping faculty data import due to missing Node.js${NC}"
        return 0
    fi
    
    # Create import script
    local import_script=$(create_data_import_script)
    
    # Install dependencies if needed
    if ! install_dependencies; then
        echo -e "${YELLOW}⚠️  Skipping faculty data import due to dependency issues${NC}"
        return 0
    fi
    
    # Run import script
    cd "$PROJECT_ROOT" || return 1
    node "$import_script"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Faculty data populated successfully${NC}"
        # Clean up import script
        rm -f "$import_script"
        return 0
    else
        echo -e "${RED}❌ Failed to populate faculty data${NC}"
        return 1
    fi
}

# Function to create initial backup
create_initial_backup() {
    echo -e "${YELLOW}💾 Creating initial backup...${NC}"
    
    # Ensure backup directory exists
    mkdir -p "$BACKUP_DIR"
    
    # Run backup script
    if [ -f "$PROJECT_ROOT/scripts/backup-database.sh" ]; then
        "$PROJECT_ROOT/scripts/backup-database.sh" >/dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Initial backup created${NC}"
        else
            echo -e "${YELLOW}⚠️  Could not create initial backup${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Backup script not found${NC}"
    fi
}

# Function to show database status
show_database_status() {
    echo -e "${BLUE}📊 Database Status:${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        local table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        local dept_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.departments;" 2>/dev/null | tail -1)
        local designation_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_designations;" 2>/dev/null | tail -1)
        local employee_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.employees;" 2>/dev/null | tail -1)
        local faculty_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_profiles;" 2>/dev/null | tail -1)
    else
        local table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        local dept_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.departments;" 2>/dev/null | tail -1)
        local designation_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_designations;" 2>/dev/null | tail -1)
        local employee_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.employees;" 2>/dev/null | tail -1)
        local faculty_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_profiles;" 2>/dev/null | tail -1)
    fi
    
    echo -e "   Database: $DB_NAME"
    echo -e "   Tables: $table_count"
    echo -e "   Departments: $dept_count"
    echo -e "   Designations: $designation_count"
    echo -e "   Employees: $employee_count"
    echo -e "   Faculty Profiles: $faculty_count"
}

# Function to show help
show_help() {
    echo -e "${BLUE}NIT GOA Database Initialization System${NC}"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  init           Initialize database (default)"
    echo "  reset          Reset database (drop and recreate)"
    echo "  schema-only    Create database and import schema only"
    echo "  data-only      Import faculty data only (assumes database exists)"
    echo "  status         Show database status"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Full initialization"
    echo "  $0 init          # Full initialization"
    echo "  $0 reset         # Drop and recreate database"
    echo "  $0 schema-only   # Create database and schema only"
    echo "  $0 data-only     # Import faculty data only"
    echo ""
}

# Main initialization function
initialize_database() {
    local force_recreate="${1:-false}"
    local schema_only="${2:-false}"
    
    # Test database connection
    if ! test_db_connection; then
        return 1
    fi
    
    # Handle existing database
    if check_database_exists; then
        if [ "$force_recreate" = "true" ]; then
            if ! drop_database; then
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
            echo -e "   Use 'reset' option to recreate or 'data-only' to just import data"
            return 1
        fi
    fi
    
    # Create database
    if ! create_database; then
        return 1
    fi
    
    # Import schema
    if ! import_schema; then
        return 1
    fi
    
    # Import faculty data (unless schema-only)
    if [ "$schema_only" != "true" ]; then
        if ! populate_faculty_data; then
            echo -e "${YELLOW}⚠️  Database created but faculty data import failed${NC}"
        fi
    fi
    
    # Create initial backup
    create_initial_backup
    
    # Show final status
    echo ""
    show_database_status
    
    echo ""
    echo -e "${GREEN}🎉 Database initialization completed successfully!${NC}"
}

# Main execution
main() {
    local command=${1:-init}
    
    case $command in
        "init"|"")
            initialize_database false false
            ;;
        "reset")
            echo -e "${YELLOW}⚠️  WARNING: This will delete all existing data!${NC}"
            echo -e "Are you sure you want to reset the database? (type 'yes' to confirm): "
            read -r confirmation
            
            if [ "$confirmation" != "yes" ]; then
                echo -e "${YELLOW}Reset cancelled${NC}"
                exit 0
            fi
            
            initialize_database true false
            ;;
        "schema-only")
            initialize_database false true
            ;;
        "data-only")
            if ! test_db_connection; then
                exit 1
            fi
            
            if ! check_database_exists; then
                echo -e "${RED}❌ Database '$DB_NAME' does not exist${NC}"
                echo -e "   Run initialization first or use 'init' option"
                exit 1
            fi
            
            populate_faculty_data
            create_initial_backup
            show_database_status
            ;;
        "status")
            if ! test_db_connection; then
                exit 1
            fi
            
            if check_database_exists; then
                show_database_status
            else
                echo -e "${YELLOW}Database '$DB_NAME' does not exist${NC}"
            fi
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $command${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}==================================================================${NC}"
}

# Run main function with all arguments
main "$@"