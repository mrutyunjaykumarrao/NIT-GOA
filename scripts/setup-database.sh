#!/bin/bash

# Faculty Management System - Database Setup Script

echo "🗄️  Faculty Management System - Database Setup"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_warning "This script is optimized for macOS. You may need to adapt the commands for your system."
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_error "Homebrew is not installed. Please install it first:"
    print_info "Visit: https://brew.sh/"
    exit 1
fi

print_status "Homebrew is installed"

# Check if MySQL is already installed
if command -v mysql &> /dev/null; then
    print_status "MySQL is already installed"
    MYSQL_INSTALLED=true
else
    print_info "MySQL not found. Installing MySQL..."
    brew install mysql
    if [ $? -eq 0 ]; then
        print_status "MySQL installed successfully"
        MYSQL_INSTALLED=true
    else
        print_error "Failed to install MySQL"
        exit 1
    fi
fi

# Start MySQL service
print_info "Starting MySQL service..."
brew services start mysql

# Wait for MySQL to start
sleep 3

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    print_error "MySQL service failed to start"
    print_info "Try manually starting with: brew services start mysql"
    exit 1
fi

print_status "MySQL service is running"

# Check if we can connect to MySQL
print_info "Testing MySQL connection..."

# Try to connect with your specific credentials
if mysql -u root -pMrutyu@2026 -e "SELECT 1;" &> /dev/null; then
    print_status "Connected to MySQL as root"
    MYSQL_ROOT_ACCESS=true
    ROOT_PASSWORD="Mrutyu@2026"
else
    print_error "Failed to connect to MySQL with provided credentials"
    print_info "Please verify your MySQL root password: Mrutyu@2026"
    exit 1
fi

# Create database and user
print_info "Creating database and user..."

MYSQL_CMD="mysql -u root -pMrutyu@2026"

# Execute database setup commands
$MYSQL_CMD << EOF
-- Create the database
CREATE DATABASE IF NOT EXISTS nitgoa_db;

-- Create a dedicated user for the application (using root user as specified)
-- Since you're using root, we'll just create the database
-- Grant privileges are not needed for root user

-- Show databases to confirm
SHOW DATABASES;
EOF

if [ $? -eq 0 ]; then
    print_status "Database and user created successfully"
else
    print_error "Failed to create database and user"
    exit 1
fi

# Import schema
print_info "Importing database schema..."

if [ -f "database/schemas/schema.sql" ]; then
    mysql -u root -pMrutyu@2026 nitgoa_db < database/schemas/schema.sql
    
    if [ $? -eq 0 ]; then
        print_status "Database schema imported successfully"
    else
        print_error "Failed to import database schema"
        exit 1
    fi
else
    print_error "Schema file not found: database/schemas/schema.sql"
    print_info "Make sure you're running this script from the project root directory"
    exit 1
fi

# Test the connection with the application user
print_info "Testing application database connection..."

mysql -u root -pMrutyu@2026 nitgoa_db -e "SHOW TABLES;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_status "Application database connection successful"
else
    print_error "Application database connection failed"
    exit 1
fi

# Display summary
echo ""
print_status "Database setup completed successfully!"
echo ""
print_info "Database Details:"
echo "  🏗️  Database Name: nitgoa_db"
echo "  👤 Username: root"
echo "  🔑 Password: Mrutyu@2026"
echo "  🌐 Host: localhost"
echo "  🚪 Port: 3306"
echo ""
print_info "Default Login Credentials:"
echo "  👨‍💼 Admin: admin / admin123"
echo "  👨‍🏫 Faculty: john.smith / faculty123"
echo "  👩‍🏫 Faculty: sarah.johnson / faculty123"
echo "  👨‍🏫 Faculty: michael.brown / faculty123"
echo ""
print_info "Next Steps:"
echo "  1. Start the backend server: cd server && npm start"
echo "  2. Start the frontend server: cd client && npm start"
echo "  3. Open http://localhost:3000 in your browser"
echo "  4. Read documentation: docs/database/DATABASE-GUIDE.md"
echo ""
print_warning "Note: Change default passwords in production!"
