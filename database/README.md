# NIT GOA Database

This directory contains all database-related files for the NIT GOA faculty management system.

## Directory Structure

```
database/
├── README.md                           # This file - comprehensive guide
├── schemas/                            # Database schema files
│   └── nitgoa_database_schema.sql      # Complete production database schema
├── seeds/                              # Data seeding files
│   └── complete_faculty_data_migration.sql # Complete faculty data seeding
├── utilities/                          # Database utility scripts
│   └── validate_schema.sql             # Schema validation script
└── archive/                            # Archived old files and reports
    ├── old_migrations/                 # All migration files (archived)
    ├── old_schemas/                    # Old schema versions
    ├── old_scripts/                    # Legacy Python/shell scripts
    └── old_reports/                    # Migration reports and logs
```

## Database Schema Overview

The NIT GOA database (`nitgoa_db`) contains 16 tables organized into the following categories:

### Core Faculty Tables
- **`faculty_profiles`** - Main faculty information and profiles
- **`faculty_academic_info`** - Academic degrees and education details
- **`faculty_publications`** - Journal articles, conference papers, etc.
- **`faculty_research_guidance`** - PhD/MTech students guided
- **`faculty_funded_projects`** - Research projects and grants
- **`faculty_awards`** - Awards and recognitions
- **`faculty_memberships`** - Professional memberships
- **`faculty_professional_services`** - Administrative and professional services
- **`faculty_courses_taught`** - UG/PG courses taught
- **`faculty_courses_attended`** - Training courses and conferences attended
- **`faculty_courses_conducted`** - Workshops and courses conducted
- **`faculty_custom_sections`** - Custom sections for additional information
- **`faculty_custom_section_items`** - Items within custom sections

### Staff Tables  
- **`technical_staff`** - Technical staff profiles and information
- **`administrative_staff`** - Administrative staff profiles and information

### System Tables
- **`users`** - User authentication and access control

## Key Files

### Schema
- **`schemas/nitgoa_database_schema.sql`** - Complete production database structure
  - Generated from live database: `mysqldump -u root -p --no-data --routines --triggers nitgoa_db`
  - Contains all 16 table structures, indexes, constraints, and relationships
  - Enhanced with clear, descriptive comments for each table
  - Verified to match actual database structure exactly
  - No data included - structure only
- **`schemas/updated_schema.sql`** - Previous schema version (reference only)

### Migrations
- All migration files have been archived to `archive/old_migrations/`
- The complete schema file serves as the single source of truth for database structure
- For fresh installations, use the schema file directly rather than individual migrations

### Seeds
- **`seeds/complete_faculty_data_migration.sql`** - Complete faculty data population script

### Utilities
- **`utilities/validate_schema.sql`** - Database schema validation script
  - Verifies table count, structure, indexes, and foreign key relationships
  - Usage: `mysql -u root -p nitgoa_db < utilities/validate_schema.sql`

## Database Connection

### Configuration
- Database: `nitgoa_db`
- Host: `localhost`
- User: `root`
- Port: `3306`

### Environment Variables
Set these in your server's `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nitgoa_db
DB_PORT=3306
```

## Usage

### 1. Fresh Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE nitgoa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
mysql -u root -p nitgoa_db < schemas/nitgoa_database_schema.sql

# Seed data (optional - only if you want to populate with sample data)
mysql -u root -p nitgoa_db < seeds/complete_faculty_data_migration.sql
```

### 2. Schema Updates
To update the schema file after database changes:
```bash
mysqldump -u root -p --no-data --routines --triggers nitgoa_db > schemas/nitgoa_database_schema.sql
```

### 3. Data Backup
```bash
# Full backup with data
mysqldump -u root -p nitgoa_db > backup_$(date +%Y%m%d).sql

# Schema only backup
mysqldump -u root -p --no-data nitgoa_db > schema_backup_$(date +%Y%m%d).sql
```

## Migration History

This database has been migrated from a JSON-based system to MySQL. Key migration steps:

1. **Initial Setup** - Basic table structure creation
2. **Faculty Migration** - Complete faculty profiles and detailed data
3. **Staff Migration** - Technical and administrative staff data
4. **Data Verification** - Comprehensive verification of all migrated data
5. **Cleanup** - Archive of old migration files and scripts

## Data Integrity

All faculty data has been completely migrated from JSON files with 100% data integrity:
- ✅ Faculty profiles: 66 records
- ✅ Technical staff: 17 records  
- ✅ Administrative staff: 24 records
- ✅ Faculty publications: Complete migration (e.g., Dr. Damodar Reddy: 123 publications)
- ✅ All detailed faculty information preserved

## Archived Files

The `archive/` directory contains:
- Old migration scripts that are no longer needed
- Previous schema versions
- Migration reports and verification documents
- Legacy Python scripts used during migration

## Maintenance

### Regular Tasks
1. **Schema Updates** - Keep `nitgoa_database_schema.sql` updated after structural changes
2. **Backups** - Regular database backups before major updates
3. **Performance** - Monitor query performance and add indexes as needed
4. **Data Integrity** - Periodic verification of faculty and staff data consistency

### Contact
For database-related issues, refer to the development team or the main project README.
