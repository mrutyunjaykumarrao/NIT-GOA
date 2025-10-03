#!/bin/bash
# =================================================================
# NIT GOA Database Backup Scheduler Setup
# Sets up automated weekly backups using cron
# =================================================================

# Set script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BLUE}        NIT GOA Database Backup Scheduler Setup${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo ""

# Function to check if cron is available
check_cron() {
    if command -v crontab >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Cron is available${NC}"
        return 0
    else
        echo -e "${RED}❌ Cron is not available on this system${NC}"
        return 1
    fi
}

# Function to setup weekly backup
setup_weekly_backup() {
    local cron_job="0 2 * * 0 $BACKUP_SCRIPT backup >> $PROJECT_ROOT/database/backups/backup.log 2>&1"
    local cron_comment="# NIT GOA Database Weekly Backup (Sundays at 2 AM)"
    
    echo -e "${YELLOW}🕐 Setting up weekly backup schedule...${NC}"
    echo -e "   Schedule: Every Sunday at 2:00 AM"
    echo -e "   Script: $BACKUP_SCRIPT"
    echo -e "   Log: $PROJECT_ROOT/database/backups/backup.log"
    echo ""
    
    # Get current crontab
    local current_crontab=$(crontab -l 2>/dev/null)
    
    # Check if our backup job already exists
    if echo "$current_crontab" | grep -q "$BACKUP_SCRIPT"; then
        echo -e "${YELLOW}⚠️  Backup job already exists in crontab${NC}"
        echo -e "   Would you like to update it? (y/N): "
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Skipping crontab setup${NC}"
            return 0
        fi
        
        # Remove existing backup jobs for this project
        current_crontab=$(echo "$current_crontab" | grep -v "$BACKUP_SCRIPT")
    fi
    
    # Add new crontab entry
    local new_crontab="$current_crontab"$'\n'"$cron_comment"$'\n'"$cron_job"
    
    # Install new crontab
    echo "$new_crontab" | crontab -
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Weekly backup scheduled successfully${NC}"
        echo -e "   Next backup: $(date -d 'next Sunday 2:00' '+%Y-%m-%d %H:%M:%S')"
        return 0
    else
        echo -e "${RED}❌ Failed to setup crontab${NC}"
        return 1
    fi
}

# Function to setup monthly backup (alternative to weekly)
setup_monthly_backup() {
    local cron_job="0 2 1 * * $BACKUP_SCRIPT backup >> $PROJECT_ROOT/database/backups/backup.log 2>&1"
    local cron_comment="# NIT GOA Database Monthly Backup (1st of every month at 2 AM)"
    
    echo -e "${YELLOW}🗓️  Setting up monthly backup schedule...${NC}"
    echo -e "   Schedule: 1st of every month at 2:00 AM"
    echo -e "   Script: $BACKUP_SCRIPT"
    echo -e "   Log: $PROJECT_ROOT/database/backups/backup.log"
    echo ""
    
    # Get current crontab
    local current_crontab=$(crontab -l 2>/dev/null)
    
    # Check if our backup job already exists
    if echo "$current_crontab" | grep -q "$BACKUP_SCRIPT"; then
        # Remove existing backup jobs for this project
        current_crontab=$(echo "$current_crontab" | grep -v "$BACKUP_SCRIPT")
    fi
    
    # Add new crontab entry
    local new_crontab="$current_crontab"$'\n'"$cron_comment"$'\n'"$cron_job"
    
    # Install new crontab
    echo "$new_crontab" | crontab -
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Monthly backup scheduled successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to setup crontab${NC}"
        return 1
    fi
}

# Function to show current cron jobs
show_current_jobs() {
    echo -e "${YELLOW}📋 Current cron jobs:${NC}"
    local current_crontab=$(crontab -l 2>/dev/null)
    
    if [ -z "$current_crontab" ]; then
        echo -e "   ${YELLOW}No cron jobs found${NC}"
    else
        echo "$current_crontab" | grep -A1 -B1 "NIT GOA\|$BACKUP_SCRIPT" || echo -e "   ${YELLOW}No NIT GOA backup jobs found${NC}"
    fi
    echo ""
}

# Function to remove scheduled backups
remove_scheduled_backups() {
    echo -e "${YELLOW}🗑️  Removing scheduled backups...${NC}"
    
    local current_crontab=$(crontab -l 2>/dev/null)
    
    if echo "$current_crontab" | grep -q "$BACKUP_SCRIPT"; then
        # Remove backup jobs and comments
        local new_crontab=$(echo "$current_crontab" | grep -v -E "$BACKUP_SCRIPT|NIT GOA Database.*Backup")
        
        echo "$new_crontab" | crontab -
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Scheduled backups removed${NC}"
        else
            echo -e "${RED}❌ Failed to remove scheduled backups${NC}"
        fi
    else
        echo -e "${YELLOW}No scheduled backups found to remove${NC}"
    fi
}

# Function to test backup manually
test_backup() {
    echo -e "${YELLOW}🧪 Running manual backup test...${NC}"
    echo ""
    
    if [ -x "$BACKUP_SCRIPT" ]; then
        $BACKUP_SCRIPT backup
    else
        echo -e "${RED}❌ Backup script is not executable: $BACKUP_SCRIPT${NC}"
        return 1
    fi
}

# Function to show help
show_help() {
    echo -e "${BLUE}NIT GOA Database Backup Scheduler${NC}"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  setup-weekly    Setup weekly backups (Sundays at 2 AM)"
    echo "  setup-monthly   Setup monthly backups (1st of month at 2 AM)"
    echo "  remove          Remove scheduled backups"
    echo "  status          Show current backup schedule"
    echo "  test            Run manual backup test"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup-weekly     # Setup weekly automated backups"
    echo "  $0 status           # Check current backup schedule"
    echo "  $0 test             # Test backup manually"
    echo "  $0 remove           # Remove automated backups"
    echo ""
}

# Main execution
main() {
    local command=${1:-help}
    
    # Check if cron is available for all commands except help
    if [ "$command" != "help" ] && [ "$command" != "test" ]; then
        if ! check_cron; then
            echo -e "${RED}Cannot proceed without cron support${NC}"
            exit 1
        fi
    fi
    
    case $command in
        "setup-weekly")
            setup_weekly_backup
            echo ""
            show_current_jobs
            ;;
        "setup-monthly")
            setup_monthly_backup
            echo ""
            show_current_jobs
            ;;
        "remove")
            remove_scheduled_backups
            echo ""
            show_current_jobs
            ;;
        "status")
            show_current_jobs
            ;;
        "test")
            test_backup
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $command${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    echo -e "${BLUE}==================================================================${NC}"
}

# Create backups directory and log file
mkdir -p "$PROJECT_ROOT/database/backups"
touch "$PROJECT_ROOT/database/backups/backup.log"

# Run main function with all arguments
main "$@"