#!/bin/bash
# =================================================================
# NIT GOA Database Restore System
# Restore database from backup files
# =================================================================

# Set script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/database/backups"

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
echo -e "${BLUE}           NIT GOA Database Restore System${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo ""

# Function to list available backups
list_backups() {
    echo -e "${YELLOW}📋 Available Backups:${NC}"
    
    local backup_files=($(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null))
    
    if [ ${#backup_files[@]} -eq 0 ]; then
        echo -e "   ${RED}No backup files found in $BACKUP_DIR${NC}"
        return 1
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
    
    return 0
}

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

# Function to create database if it doesn't exist
create_database_if_needed() {
    echo -e "${YELLOW}🏗️  Checking if database exists...${NC}"
    
    local db_exists
    if [ -z "$DB_PASSWORD" ]; then
        db_exists=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$DB_NAME';" 2>/dev/null | grep -c "$DB_NAME")
    else
        db_exists=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$DB_NAME';" 2>/dev/null | grep -c "$DB_NAME")
    fi
    
    if [ "$db_exists" -eq 0 ]; then
        echo -e "${YELLOW}📝 Database '$DB_NAME' does not exist. Creating...${NC}"
        
        if [ -z "$DB_PASSWORD" ]; then
            mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        else
            mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
        fi
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
        else
            echo -e "${RED}❌ Failed to create database '$DB_NAME'${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ Database '$DB_NAME' already exists${NC}"
    fi
    
    return 0
}

# Function to backup current database before restore
backup_current_database() {
    echo -e "${YELLOW}💾 Creating backup of current database before restore...${NC}"
    
    local pre_restore_backup="$BACKUP_DIR/pre_restore_backup_$(date +"%Y%m%d_%H%M%S").sql"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" --single-transaction --routines --triggers "$DB_NAME" > "$pre_restore_backup" 2>/dev/null
    else
        mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --single-transaction --routines --triggers "$DB_NAME" > "$pre_restore_backup" 2>/dev/null
    fi
    
    if [ $? -eq 0 ] && [ -s "$pre_restore_backup" ]; then
        echo -e "${GREEN}✅ Current database backed up to: $(basename "$pre_restore_backup")${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Could not backup current database (might be empty)${NC}"
        [ -f "$pre_restore_backup" ] && rm "$pre_restore_backup"
        return 0
    fi
}

# Function to restore from backup file
restore_from_backup() {
    local backup_file="$1"
    local skip_backup="${2:-false}"
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}❌ Backup file not found: $backup_file${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔄 Restoring database from backup...${NC}"
    echo -e "   Backup file: $(basename "$backup_file")"
    echo -e "   Target database: $DB_NAME"
    echo ""
    
    # Create database if needed
    if ! create_database_if_needed; then
        return 1
    fi
    
    # Backup current database unless skipped
    if [ "$skip_backup" != "true" ]; then
        backup_current_database
    fi
    
    # Perform the restore
    echo -e "${YELLOW}📥 Importing backup file...${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$backup_file" 2>/dev/null
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$backup_file" 2>/dev/null
    fi
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ Database restored successfully${NC}"
        
        # Get table count to verify restore
        local table_count
        if [ -z "$DB_PASSWORD" ]; then
            table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        else
            table_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null | tail -1)
        fi
        
        echo -e "   Tables restored: $table_count"
        return 0
    else
        echo -e "${RED}❌ Database restore failed${NC}"
        return 1
    fi
}

# Function for interactive restore
interactive_restore() {
    if ! list_backups; then
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}Select a backup to restore (enter number):${NC}"
    read -r selection
    
    # Get backup files array
    local backup_files=($(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null))
    
    # Validate selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backup_files[@]} ]; then
        echo -e "${RED}❌ Invalid selection${NC}"
        return 1
    fi
    
    local selected_backup="${backup_files[$((selection-1))]}"
    
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: This will replace the current database!${NC}"
    echo -e "Selected backup: $(basename "$selected_backup")"
    echo -e "Target database: $DB_NAME"
    echo ""
    echo -e "Do you want to continue? (type 'yes' to confirm): "
    read -r confirmation
    
    if [ "$confirmation" != "yes" ]; then
        echo -e "${YELLOW}Restore cancelled${NC}"
        return 0
    fi
    
    restore_from_backup "$selected_backup"
}

# Function to restore latest backup
restore_latest() {
    local latest_backup=$(ls -1t "$BACKUP_DIR"/nitgoa_backup_*.sql 2>/dev/null | head -n 1)
    
    if [ -z "$latest_backup" ]; then
        echo -e "${RED}❌ No backup files found${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Restoring from latest backup: $(basename "$latest_backup")${NC}"
    echo ""
    
    restore_from_backup "$latest_backup"
}

# Function to restore from specific file
restore_from_file() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ Please specify a backup file${NC}"
        return 1
    fi
    
    # Handle relative paths
    if [[ "$backup_file" != /* ]]; then
        # If it's just a filename, look in backup directory
        if [[ "$backup_file" != */* ]]; then
            backup_file="$BACKUP_DIR/$backup_file"
        else
            # Make it absolute
            backup_file="$(pwd)/$backup_file"
        fi
    fi
    
    restore_from_backup "$backup_file"
}

# Function to show help
show_help() {
    echo -e "${BLUE}NIT GOA Database Restore System${NC}"
    echo ""
    echo "Usage: $0 [OPTION] [BACKUP_FILE]"
    echo ""
    echo "Options:"
    echo "  interactive    Interactive restore (choose from list)"
    echo "  latest         Restore from latest backup"
    echo "  file FILE      Restore from specific backup file"
    echo "  list           List available backups"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Interactive restore"
    echo "  $0 interactive                       # Interactive restore"
    echo "  $0 latest                           # Restore latest backup"
    echo "  $0 file nitgoa_backup_20231002.sql # Restore specific file"
    echo "  $0 list                             # List available backups"
    echo ""
}

# Main execution
main() {
    local command=${1:-interactive}
    local backup_file="$2"
    
    case $command in
        "interactive"|"")
            if ! test_db_connection; then
                exit 1
            fi
            interactive_restore
            ;;
        "latest")
            if ! test_db_connection; then
                exit 1
            fi
            restore_latest
            ;;
        "file")
            if ! test_db_connection; then
                exit 1
            fi
            restore_from_file "$backup_file"
            ;;
        "list")
            list_backups
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