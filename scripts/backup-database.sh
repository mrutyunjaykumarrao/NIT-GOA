#!/bin/bash

# Database Backup Script
# Creates a backup of the current database before making changes

echo "💾 Creating database backup..."

# Database configuration
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="Mrutyu@2026"
DB_NAME="nitgoa_db"
DB_PORT="3306"

# Create backup directory if it doesn't exist
mkdir -p database/backups

# Generate backup filename with timestamp
BACKUP_FILE="database/backups/nitgoa_backup_$(date +%Y%m%d_%H%M%S).sql"

# Create database backup
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database backup created: $BACKUP_FILE"
    echo "📁 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Error creating database backup!"
    exit 1
fi

echo "💾 Backup completed successfully!"
