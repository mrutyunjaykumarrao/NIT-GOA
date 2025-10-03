#!/bin/bash
# =================================================================
# NIT GOA Database Backup System
# Automated backup script with rotation (keeps 2 most recent backups)
# =================================================================

# Set script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/database/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Load environment variables from server/.env
ENV_FILE="$PROJECT_ROOT/server/.env"
if [ -f "$ENV_FILE" ]; then
    # Export variables from .env file
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "❌ Error: .env file not found at $ENV_FILE"
    echo "Please ensure server/.env exists with database configuration"
    exit 1
fi

# Database configuration from environment variables
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-updated_nitgoa}
DB_PORT=${DB_PORT:-3306}

# Backup configuration
MAX_BACKUPS=2
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="nitgoa_backup_${TIMESTAMP}.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}           NIT GOA Database Backup System${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo ""
echo -e "${YELLOW}📊 Backup Configuration:${NC}"
echo -e "   Database: ${DB_NAME}"
echo -e "   Host: ${DB_HOST}:${DB_PORT}"
echo -e "   User: ${DB_USER}"
echo -e "   Backup Directory: ${BACKUP_DIR}"
echo -e "   Max Backups: ${MAX_BACKUPS}"
echo ""

# Function to test database connection
test_db_connection() {
    echo -e "${YELLOW}🔍 Testing database connection...${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1;" "$DB_NAME" >/dev/null 2>&1
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME" >/dev/null 2>&1
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        echo -e "${RED}   Please check your database credentials in server/.env${NC}"
        return 1
    fi
}

# Function to get database size and table count
get_db_info() {
    local size_query="SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size (MB)',
        COUNT(*) AS 'Tables'
    FROM information_schema.tables 
    WHERE table_schema = '$DB_NAME';"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "$size_query" "$DB_NAME" 2>/dev/null
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "$size_query" "$DB_NAME" 2>/dev/null
    fi
}

# Function to create database backup
create_backup() {
    echo -e "${YELLOW}💾 Creating database backup...${NC}"
    echo -e "   Backup file: ${BACKUP_FILENAME}"
    
    # Get database info before backup
    echo -e "${YELLOW}📈 Database Information:${NC}"
    get_db_info
    echo ""
    
    # Create backup with progress indication
    local mysqldump_options="--single-transaction --routines --triggers --events --quick --lock-tables=false"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" $mysqldump_options "$DB_NAME" > "$BACKUP_PATH" 2>/dev/null
    else
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" $mysqldump_options "$DB_NAME" > "$BACKUP_PATH" 2>/dev/null
    fi
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ] && [ -f "$BACKUP_PATH" ] && [ -s "$BACKUP_PATH" ]; then
        local backup_size=$(ls -lh "$BACKUP_PATH" | awk '{print $5}')
        echo -e "${GREEN}✅ Backup created successfully${NC}"
        echo -e "   File size: ${backup_size}"
        echo -e "   Location: ${BACKUP_PATH}"
        return 0
    else
        echo -e "${RED}❌ Backup creation failed${NC}"
        # Clean up failed backup file
        [ -f "$BACKUP_PATH" ] && rm "$BACKUP_PATH"
        return 1
    fi
}

# Function to manage backup rotation
manage_backup_rotation() {
    echo -e "${YELLOW}🗂️  Managing backup rotation...${NC}"
    
    # Get list of backup files sorted by modification time (newest first)
    local backup_files=($(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null))
    local backup_count=${#backup_files[@]}
    
    echo -e "   Current backups: ${backup_count}"
    echo -e "   Maximum allowed: ${MAX_BACKUPS}"
    
    if [ $backup_count -gt $MAX_BACKUPS ]; then
        local files_to_delete=$((backup_count - MAX_BACKUPS))
        echo -e "${YELLOW}   Removing ${files_to_delete} old backup(s)...${NC}"
        
        # Remove oldest backups
        for ((i=MAX_BACKUPS; i<backup_count; i++)); do
            local file_to_delete="${backup_files[$i]}"
            echo -e "   🗑️  Removing: $(basename "$file_to_delete")"
            rm "$file_to_delete"
        done
        
        echo -e "${GREEN}✅ Backup rotation completed${NC}"
    else
        echo -e "${GREEN}✅ No rotation needed${NC}"
    fi
}

# Function to list current backups
list_backups() {
    echo ""
    echo -e "${YELLOW}📋 Current Backups:${NC}"
    
    local backup_files=($(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null))
    
    if [ ${#backup_files[@]} -eq 0 ]; then
        echo -e "   ${YELLOW}No backups found${NC}"
        return
    fi
    
    local count=1
    for backup_file in "${backup_files[@]}"; do
        local filename=$(basename "$backup_file")
        local file_size=$(ls -lh "$backup_file" | awk '{print $5}')
        local file_date=$(date -r "$backup_file" "+%Y-%m-%d %H:%M:%S")
        
        echo -e "   ${count}. ${filename}"
        echo -e "      Size: ${file_size} | Created: ${file_date}"
        ((count++))
    done
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$1"
    echo -e "${YELLOW}🔍 Verifying backup integrity...${NC}"
    
    # Check if file exists and is not empty
    if [ ! -f "$backup_file" ] || [ ! -s "$backup_file" ]; then
        echo -e "${RED}❌ Backup file is missing or empty${NC}"
        return 1
    fi
    
    # Check if file contains SQL content
    if head -n 20 "$backup_file" | grep -q "MySQL dump"; then
        echo -e "${GREEN}✅ Backup file appears to be valid MySQL dump${NC}"
        return 0
    else
        echo -e "${RED}❌ Backup file does not appear to be a valid MySQL dump${NC}"
        return 1
    fi
}

# Function to show help
show_help() {
    echo -e "${BLUE}NIT GOA Database Backup System${NC}"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  backup    Create a new database backup (default)"
    echo "  list      List current backups"
    echo "  verify    Verify the latest backup"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Create backup"
    echo "  $0 backup         # Create backup"
    echo "  $0 list           # List all backups"
    echo "  $0 verify         # Verify latest backup"
    echo ""
}

# Main execution
main() {
    local command=${1:-backup}
    
    case $command in
        "backup"|"")
            # Test database connection first
            if ! test_db_connection; then
                exit 1
            fi
            
            # Create backup
            if create_backup; then
                verify_backup "$BACKUP_PATH"
                manage_backup_rotation
                list_backups
                echo ""
                echo -e "${GREEN}🎉 Backup process completed successfully!${NC}"
                echo -e "${BLUE}==================================================================${NC}"
                exit 0
            else
                echo ""
                echo -e "${RED}❌ Backup process failed!${NC}"
                echo -e "${BLUE}==================================================================${NC}"
                exit 1
            fi
            ;;
        "list")
            list_backups
            echo ""
            ;;
        "verify")
            local latest_backup=$(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null | head -n 1)
            if [ -n "$latest_backup" ]; then
                verify_backup "$latest_backup"
            else
                echo -e "${YELLOW}No backups found to verify${NC}"
            fi
            echo ""
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
}

# Run main function with all arguments
main "$@"