#!/bin/bash

# Database migration script for pending approvals feature
# This script adds the pending_approvals table and related indexes

echo "🔄 Running database migration for pending approvals feature..."

# Check if we're in the correct directory
if [ ! -f "server/src/config/database.js" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Source the database configuration
source .env 2>/dev/null || echo "⚠️ No .env file found, using default MySQL connection"

# Set default values if not provided in .env
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-nitgoa_db}

echo "📊 Connecting to database: $DB_NAME@$DB_HOST"

# Run the migration
mysql -h "$DB_HOST" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} "$DB_NAME" < database/schemas/pending_approvals_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully!"
    echo "📝 Added pending_approvals table and related indexes"
else
    echo "❌ Database migration failed!"
    exit 1
fi

echo "🎉 Migration complete! You can now use the enhanced staff management features."
