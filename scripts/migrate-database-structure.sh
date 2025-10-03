#!/bin/bash
# =================================================================
# NIT GOA Database Structure Migration Script
# Migrates existing database to new improved structure
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

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}        NIT GOA Database Structure Migration${NC}"
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
        return 1
    fi
}

# Function to create backup before migration
create_pre_migration_backup() {
    echo -e "${YELLOW}💾 Creating pre-migration backup...${NC}"
    
    local backup_file="$PROJECT_ROOT/database/backups/pre_migration_backup_$(date +"%Y%m%d_%H%M%S").sql"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" --single-transaction --routines --triggers "$DB_NAME" > "$backup_file" 2>/dev/null
    else
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --single-transaction --routines --triggers "$DB_NAME" > "$backup_file" 2>/dev/null
    fi
    
    if [ $? -eq 0 ] && [ -s "$backup_file" ]; then
        echo -e "${GREEN}✅ Pre-migration backup created: $(basename "$backup_file")${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to create backup${NC}"
        return 1
    fi
}

# Function to migrate database structure
migrate_database_structure() {
    echo -e "${YELLOW}🔄 Migrating database structure...${NC}"
    
    # Create migration script
    local migration_script="$PROJECT_ROOT/scripts/database-migration.js"
    
    cat > "$migration_script" << 'EOF'
const mysql = require('mysql2/promise');
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

async function migrateDatabase() {
    let connection;
    
    try {
        console.log(`${colors.blue}==================================================================`);
        console.log(`           NIT GOA Database Structure Migration`);
        console.log(`==================================================================${colors.reset}\n`);
        
        // Connect to database
        console.log(`${colors.yellow}🔌 Connecting to database...${colors.reset}`);
        connection = await mysql.createConnection(dbConfig);
        console.log(`${colors.green}✅ Connected to database: ${dbConfig.database}${colors.reset}\n`);
        
        // Step 1: Create temporary tables with new structure
        console.log(`${colors.yellow}🏗️  Creating new table structures...${colors.reset}`);
        
        // Create new employees table
        await connection.execute(`
            CREATE TABLE employees_new (
                employee_id INT PRIMARY KEY AUTO_INCREMENT,
                employee_code VARCHAR(50) UNIQUE NOT NULL,
                honorific ENUM('Dr.','Mr.','Mrs.','Ms.','Prof.'),
                full_name VARCHAR(255) NOT NULL,
                gender ENUM('Male','Female','Other'),
                role ENUM('Faculty','Administrative','Technical') NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                extension_no VARCHAR(20),
                phone_mobile VARCHAR(20),
                phone_residence VARCHAR(50),
                date_of_joining DATE,
                is_active TINYINT(1) DEFAULT 1,
                is_public_visible TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_employee_code (employee_code),
                INDEX idx_role (role),
                INDEX idx_active (is_active),
                INDEX idx_public_visible (is_public_visible),
                INDEX idx_email (email)
            )
        `);
        
        // Create new faculty_profiles table
        await connection.execute(`
            CREATE TABLE faculty_profiles_new (
                employee_code VARCHAR(50) PRIMARY KEY,
                department_id INT,
                designation_id INT,
                date_of_birth DATE,
                is_hod TINYINT(1) DEFAULT 0,
                image_url VARCHAR(255),
                research_teaching_experience TEXT,
                address TEXT,
                office_location VARCHAR(100),
                office_hours VARCHAR(255),
                linkedin_url VARCHAR(255),
                personal_website_url VARCHAR(255),
                google_scholar_url VARCHAR(255),
                orcid_id VARCHAR(50),
                scopus_id VARCHAR(50),
                research_gate_url VARCHAR(255),
                other_social_links JSON,
                bio_summary TEXT,
                research_interests TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_code) REFERENCES employees_new(employee_code) ON DELETE CASCADE,
                FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
                FOREIGN KEY (designation_id) REFERENCES faculty_designations(designation_id) ON DELETE SET NULL,
                INDEX idx_department (department_id),
                INDEX idx_designation (designation_id),
                INDEX idx_hod (is_hod),
                INDEX idx_display_order (display_order)
            )
        `);
        
        // Create new staff_profiles table
        await connection.execute(`
            CREATE TABLE staff_profiles_new (
                employee_code VARCHAR(50) PRIMARY KEY,
                department_id INT,
                job_title VARCHAR(100),
                responsibilities TEXT,
                employment_status VARCHAR(100),
                image_url VARCHAR(255),
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_code) REFERENCES employees_new(employee_code) ON DELETE CASCADE,
                FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
                INDEX idx_department (department_id),
                INDEX idx_job_title (job_title),
                INDEX idx_employment_status (employment_status)
            )
        `);
        
        console.log(`${colors.green}✅ New table structures created${colors.reset}`);
        
        // Step 2: Migrate data from old to new tables
        console.log(`${colors.yellow}📊 Migrating existing data...${colors.reset}`);
        
        // Migrate employees data
        await connection.execute(`
            INSERT INTO employees_new (
                employee_code, honorific, full_name, role, email, extension_no, 
                phone_mobile, phone_residence, date_of_joining, is_active, 
                is_public_visible, created_at, updated_at
            )
            SELECT 
                employee_code, honorific, full_name, role, email, extension_no,
                phone_mobile, phone_residence, date_of_joining, is_active,
                is_public_visible, created_at, updated_at
            FROM employees
        `);
        
        // Update gender in employees_new from faculty_profiles
        await connection.execute(`
            UPDATE employees_new en
            JOIN faculty_profiles fp ON en.employee_code = fp.employee_code
            SET en.gender = fp.gender
        `);
        
        console.log(`   ✅ Employees data migrated`);
        
        // Migrate faculty_profiles data
        await connection.execute(`
            INSERT INTO faculty_profiles_new (
                employee_code, date_of_birth, research_teaching_experience, address,
                office_location, office_hours, linkedin_url, personal_website_url,
                google_scholar_url, orcid_id, scopus_id, research_gate_url,
                other_social_links, bio_summary, research_interests, created_at, updated_at
            )
            SELECT 
                employee_code, date_of_birth, research_teaching_experience, address,
                office_location, office_hours, linkedin_url, personal_website_url,
                google_scholar_url, orcid_id, scopus_id, research_gate_url,
                other_social_links, bio_summary, research_interests, created_at, updated_at
            FROM faculty_profiles
        `);
        
        // Update faculty_profiles_new with data from employees
        await connection.execute(`
            UPDATE faculty_profiles_new fn
            JOIN employees e ON fn.employee_code = e.employee_code
            SET fn.department_id = e.department_id,
                fn.designation_id = e.designation_id,
                fn.is_hod = e.is_hod,
                fn.image_url = e.image_url,
                fn.display_order = e.display_order
        `);
        
        console.log(`   ✅ Faculty profiles data migrated`);
        
        // Migrate staff_profiles data (if any exist)
        const [staffRows] = await connection.execute('SELECT COUNT(*) as count FROM staff_profiles');
        if (staffRows[0].count > 0) {
            await connection.execute(`
                INSERT INTO staff_profiles_new (
                    employee_code, department_id, responsibilities, created_at, updated_at
                )
                SELECT 
                    employee_code, department_id, responsibilities, created_at, updated_at
                FROM staff_profiles
            `);
            
            // Update staff_profiles_new with data from employees
            await connection.execute(`
                UPDATE staff_profiles_new sn
                JOIN employees e ON sn.employee_code = e.employee_code
                SET sn.job_title = e.job_title,
                    sn.employment_status = e.employment_status,
                    sn.image_url = e.image_url,
                    sn.display_order = e.display_order
            `);
            
            console.log(`   ✅ Staff profiles data migrated`);
        } else {
            console.log(`   ℹ️  No staff profiles to migrate`);
        }
        
        // Step 3: Drop old tables and rename new ones
        console.log(`${colors.yellow}🔄 Replacing old tables with new structure...${colors.reset}`);
        
        // Disable foreign key checks temporarily
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        // Drop old tables
        await connection.execute('DROP TABLE IF EXISTS faculty_profiles');
        await connection.execute('DROP TABLE IF EXISTS staff_profiles');
        await connection.execute('DROP TABLE IF EXISTS employees');
        
        // Rename new tables
        await connection.execute('RENAME TABLE employees_new TO employees');
        await connection.execute('RENAME TABLE faculty_profiles_new TO faculty_profiles');
        await connection.execute('RENAME TABLE staff_profiles_new TO staff_profiles');
        
        // Re-enable foreign key checks
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log(`${colors.green}✅ Table structure migration completed${colors.reset}`);
        
        // Step 4: Verify migration
        console.log(`${colors.yellow}🔍 Verifying migration...${colors.reset}`);
        
        const [empCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
        const [facCount] = await connection.execute('SELECT COUNT(*) as count FROM faculty_profiles');
        const [staffCount] = await connection.execute('SELECT COUNT(*) as count FROM staff_profiles');
        
        console.log(`${colors.green}📊 Migration Summary:${colors.reset}`);
        console.log(`   Employees: ${empCount[0].count}`);
        console.log(`   Faculty Profiles: ${facCount[0].count}`);
        console.log(`   Staff Profiles: ${staffCount[0].count}`);
        
        // Verify some sample data
        const [sample] = await connection.execute(`
            SELECT e.employee_code, e.full_name, e.gender, f.department_id, f.is_hod 
            FROM employees e 
            JOIN faculty_profiles f ON e.employee_code = f.employee_code 
            LIMIT 3
        `);
        
        console.log(`${colors.green}✅ Sample migrated data:${colors.reset}`);
        sample.forEach(row => {
            console.log(`   ${row.employee_code}: ${row.full_name} (Gender: ${row.gender}, Dept: ${row.department_id}, HOD: ${row.is_hod})`);
        });
        
    } catch (error) {
        console.error(`${colors.red}❌ Migration failed: ${error.message}${colors.reset}`);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the migration
migrateDatabase();
EOF
    
}

# Function to install Node.js dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    
    cd "$PROJECT_ROOT/server" || return 1
    
    # Install dependencies
    npm install mysql2 >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        return 1
    fi
}

# Function to show final status
show_final_status() {
    echo -e "${BLUE}📊 Final Database Status:${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        local emp_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.employees;" 2>/dev/null | tail -1)
        local fac_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_profiles;" 2>/dev/null | tail -1)
        local staff_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.staff_profiles;" 2>/dev/null | tail -1)
    else
        local emp_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.employees;" 2>/dev/null | tail -1)
        local fac_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.faculty_profiles;" 2>/dev/null | tail -1)
        local staff_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.staff_profiles;" 2>/dev/null | tail -1)
    fi
    
    echo -e "   Database: $DB_NAME"
    echo -e "   Employees (new structure): $emp_count"
    echo -e "   Faculty Profiles (new structure): $fac_count"
    echo -e "   Staff Profiles (new structure): $staff_count"
}

# Main execution
main() {
    local command=${1:-migrate}
    
    case $command in
        "migrate"|"")
            echo -e "${YELLOW}⚠️  WARNING: This will restructure your database tables!${NC}"
            echo -e "This migration will:"
            echo -e "  • Move gender field from faculty_profiles to employees"
            echo -e "  • Move department_id, designation_id, is_hod, image_url, display_order to faculty_profiles"
            echo -e "  • Restructure staff_profiles table"
            echo -e "  • Create backup before changes"
            echo ""
            echo -e "Do you want to continue? (type 'yes' to confirm): "
            read -r confirmation
            
            if [ "$confirmation" != "yes" ]; then
                echo -e "${YELLOW}Migration cancelled${NC}"
                exit 0
            fi
            
            if ! test_db_connection; then
                exit 1
            fi
            
            if ! create_pre_migration_backup; then
                echo -e "${RED}❌ Cannot proceed without backup${NC}"
                exit 1
            fi
            
            if ! install_dependencies; then
                echo -e "${YELLOW}⚠️  Continuing without dependency installation${NC}"
            fi
            
            # Create and run migration script
            migrate_database_structure
            local migration_script="$PROJECT_ROOT/scripts/database-migration.js"
            cd "$PROJECT_ROOT" || exit 1
            node "$migration_script"
            
            # Clean up migration script
            rm -f "$migration_script"
            
            show_final_status
            ;;
        "status")
            if ! test_db_connection; then
                exit 1
            fi
            show_final_status
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}NIT GOA Database Structure Migration${NC}"
            echo ""
            echo "Usage: $0 [OPTION]"
            echo ""
            echo "Options:"
            echo "  migrate    Perform database structure migration (default)"
            echo "  status     Show current database status"
            echo "  help       Show this help message"
            echo ""
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $command${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}==================================================================${NC}"
}

# Run main function with all arguments
main "$@"