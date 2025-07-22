#!/bin/bash

# Faculty Data Migration Script
# This script sets up the database schema and migrates faculty data from JSON files

echo "=== Faculty Data Migration Script ==="
echo "This script will:"
echo "1. Drop existing faculty data"
echo "2. Update database schema"
echo "3. Migrate all faculty data from JSON files"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if mysql-connector-python is installed
python3 -c "import mysql.connector" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing mysql-connector-python..."
    pip3 install mysql-connector-python
fi

# Get database credentials
echo "Please enter your MySQL database credentials:"
read -p "MySQL host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "MySQL username [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "MySQL password: " DB_PASSWORD
echo ""

read -p "Database name [nitgoa_db]: " DB_NAME
DB_NAME=${DB_NAME:-nitgoa_db}

# Update the Python script with credentials
cd "$(dirname "$0")"

# Create a temporary config file
cat > db_config.py << EOF
DB_CONFIG = {
    'host': '$DB_HOST',
    'user': '$DB_USER',
    'password': '$DB_PASSWORD',
    'database': '$DB_NAME',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_0900_ai_ci'
}
EOF

# Update the migration script to use the config
sed -i.bak "s/^DB_CONFIG = {.*$/from db_config import DB_CONFIG/" migrate_faculty_data.py

echo ""
echo "Starting migration..."
python3 migrate_faculty_data.py

# Clean up
rm -f db_config.py
mv migrate_faculty_data.py.bak migrate_faculty_data.py

echo ""
echo "Migration completed!"
echo "You can now access the faculty data through your application."
