#!/bin/bash
# =================================================================
# NIT GOA User Accounts Population Script
# Creates initial user accounts for system access
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
echo -e "${BLUE}           NIT GOA User Accounts Population${NC}"
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

# Function to create user accounts
create_user_accounts() {
    echo -e "${YELLOW}👥 Creating user accounts...${NC}"
    
    # Create import script
    local import_script="$PROJECT_ROOT/scripts/import-users.js"
    
    cat > "$import_script" << 'EOF'
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
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

async function createUserAccounts() {
    let connection;
    
    try {
        console.log(`${colors.blue}==================================================================`);
        console.log(`           NIT GOA User Accounts Creation`);
        console.log(`==================================================================${colors.reset}\n`);
        
        // Connect to database
        console.log(`${colors.yellow}🔌 Connecting to database...${colors.reset}`);
        connection = await mysql.createConnection(dbConfig);
        console.log(`${colors.green}✅ Connected to database: ${dbConfig.database}${colors.reset}\n`);
        
        // Check existing users
        const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM user_accounts');
        console.log(`${colors.yellow}📊 Existing users: ${existingUsers[0].count}${colors.reset}`);
        
        // Define user accounts to create
        const usersToCreate = [
            {
                username: 'admin',
                email: 'admin@nitgoa.ac.in',
                password: 'nitgoa2024',
                access_level: 'Admin',
                employee_code: null,
                description: 'System Administrator'
            },
            {
                username: 'veenat',
                email: 'veenat@nitgoa.ac.in',
                password: 'faculty2024',
                access_level: 'Faculty',
                employee_code: 'FAC001',
                description: 'Dr. Veena Thenkanidiyoor (CSE HOD)'
            },
            {
                username: 'dr.reddy',
                email: 'dr.reddy@nitgoa.ac.in', 
                password: 'faculty2024',
                access_level: 'Faculty',
                employee_code: 'FAC002',
                description: 'Dr. Damodar Reddy Edla (CSE Faculty)'
            },
            {
                username: 'tveerakumar',
                email: 'tveerakumar@nitgoa.ac.in',
                password: 'faculty2024', 
                access_level: 'Faculty',
                employee_code: 'FAC013',
                description: 'Dr. T. Veerakumar (ECE HOD)'
            },
            {
                username: 'mikkili.suresh',
                email: 'mikkili.suresh@nitgoa.ac.in',
                password: 'faculty2024',
                access_level: 'Faculty', 
                employee_code: 'FAC025',
                description: 'Dr. Suresh Mikkili (EEE HOD)'
            },
            {
                username: 'prasenjit.dey',
                email: 'prasenjit.dey@nitgoa.ac.in',
                password: 'faculty2024',
                access_level: 'Faculty',
                employee_code: 'FAC037', 
                description: 'Dr. Prasenjit Dey (MCE HOD)'
            },
            {
                username: 'harikumar',
                email: 'harikumar@nitgoa.ac.in',
                password: 'faculty2024',
                access_level: 'Faculty',
                employee_code: 'FAC048',
                description: 'Harikumar M (CVE HOD)'
            },
            {
                username: 'shangerganesh',
                email: 'shangerganesh@nitgoa.ac.in', 
                password: 'faculty2024',
                access_level: 'Faculty',
                employee_code: 'FAC059',
                description: 'L. Shangerganesh (APS & HSS HOD)'
            }
        ];
        
        console.log(`${colors.yellow}👤 Creating ${usersToCreate.length} user accounts...${colors.reset}\n`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const user of usersToCreate) {
            try {
                // Check if username already exists
                const [existingUsername] = await connection.execute(
                    'SELECT username FROM user_accounts WHERE username = ?',
                    [user.username]
                );
                
                if (existingUsername.length > 0) {
                    console.log(`   ${colors.yellow}⚠️  User '${user.username}' already exists, skipping...${colors.reset}`);
                    continue;
                }
                
                // Hash password
                const passwordHash = await bcrypt.hash(user.password, 10);
                
                // Insert user
                await connection.execute(`
                    INSERT INTO user_accounts 
                    (username, email, password_hash, employee_code, access_level, is_active, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
                `, [
                    user.username,
                    user.email,
                    passwordHash, 
                    user.employee_code,
                    user.access_level
                ]);
                
                successCount++;
                console.log(`   ${colors.green}✅ Created user: ${user.username} (${user.description})${colors.reset}`);
                
            } catch (error) {
                errorCount++;
                console.error(`   ${colors.red}❌ Error creating user '${user.username}': ${error.message}${colors.reset}`);
            }
        }
        
        console.log(`\n${colors.green}✅ User creation completed${colors.reset}`);
        console.log(`   Successfully created: ${successCount} users`);
        if (errorCount > 0) {
            console.log(`   ${colors.yellow}Errors encountered: ${errorCount} users${colors.reset}`);
        }
        
        // Show final user statistics
        const [adminCount] = await connection.execute("SELECT COUNT(*) as count FROM user_accounts WHERE access_level = 'Admin'");
        const [facultyCount] = await connection.execute("SELECT COUNT(*) as count FROM user_accounts WHERE access_level = 'Faculty'");
        const [staffCount] = await connection.execute("SELECT COUNT(*) as count FROM user_accounts WHERE access_level = 'Staff'");
        const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM user_accounts');
        
        console.log(`\n${colors.blue}📊 Final User Statistics:${colors.reset}`);
        console.log(`   Admin users: ${adminCount[0].count}`);
        console.log(`   Faculty users: ${facultyCount[0].count}`);
        console.log(`   Staff users: ${staffCount[0].count}`);
        console.log(`   Total users: ${totalCount[0].count}${colors.reset}`);
        
        // Show login credentials
        console.log(`\n${colors.yellow}🔑 Default Login Credentials:${colors.reset}`);
        console.log(`   Admin Login:`);
        console.log(`     Username: admin`);
        console.log(`     Password: nitgoa2024`);
        console.log(`   Faculty Login (example):`);
        console.log(`     Username: veenat`);
        console.log(`     Password: faculty2024`);
        console.log(`\n   ${colors.yellow}⚠️  Please change default passwords after first login!${colors.reset}`);
        
    } catch (error) {
        console.error(`${colors.red}❌ User creation failed: ${error.message}${colors.reset}`);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the user creation
createUserAccounts();
EOF
    
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
    
    # Install dependencies (including bcrypt)
    npm install bcrypt >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        return 1
    fi
}

# Function to show current user status
show_user_status() {
    echo -e "${BLUE}📊 Current User Account Status:${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        local total_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts;" 2>/dev/null | tail -1)
        local admin_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts WHERE access_level = 'Admin';" 2>/dev/null | tail -1)
        local faculty_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts WHERE access_level = 'Faculty';" 2>/dev/null | tail -1)
    else
        local total_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts;" 2>/dev/null | tail -1)
        local admin_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts WHERE access_level = 'Admin';" 2>/dev/null | tail -1)
        local faculty_users=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM $DB_NAME.user_accounts WHERE access_level = 'Faculty';" 2>/dev/null | tail -1)
    fi
    
    echo -e "   Database: $DB_NAME"
    echo -e "   Total Users: $total_users"
    echo -e "   Admin Users: $admin_users"
    echo -e "   Faculty Users: $faculty_users"
}

# Main execution
main() {
    local command=${1:-create}
    
    case $command in
        "create"|"")
            if ! test_db_connection; then
                exit 1
            fi
            
            if ! install_dependencies; then
                echo -e "${YELLOW}⚠️  Continuing without bcrypt installation${NC}"
            fi
            
            # Create and run user import script
            create_user_accounts
            local import_script="$PROJECT_ROOT/scripts/import-users.js"
            cd "$PROJECT_ROOT" || exit 1
            node "$import_script"
            
            # Clean up import script
            rm -f "$import_script"
            
            show_user_status
            ;;
        "status")
            if ! test_db_connection; then
                exit 1
            fi
            show_user_status
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}NIT GOA User Accounts Population${NC}"
            echo ""
            echo "Usage: $0 [OPTION]"
            echo ""
            echo "Options:"
            echo "  create    Create initial user accounts (default)"
            echo "  status    Show current user account status"
            echo "  help      Show this help message"
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