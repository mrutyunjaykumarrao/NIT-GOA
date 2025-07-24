# Database Files for Faculty Management System

This directory contains the essential database files for the Faculty Management System.

## Folder Structure

```
database/
├── schemas/           # Database schema files
│   └── schema.sql    # Main database schema
├── migrations/       # Database migration scripts
│   └── faculty_data_migration.sql
├── seeds/           # Seed data files
│   └── complete_faculty_data_migration.sql
└── backups/         # Database backup files
```

## Files Description

### Core Schema (`schemas/`)
- **`schema.sql`** - **CORRECTED & VERIFIED** Main database schema file
  - Contains all table definitions with proper constraints
  - Includes initial admin user account
  - Sample faculty data for testing
  - Indexes for optimal performance
  - Character set: utf8mb4, Collation: utf8mb4_0900_ai_ci
  - Compatible with MySQL 8.0+

### Data Migrations (`migrations/`)
- **`faculty_data_migration.sql`** - Initial faculty data migration
  - Basic faculty profiles setup
  - Essential data for development/testing
  - Safe to run multiple times (idempotent)

### Seed Data (`seeds/`)
- **`complete_faculty_data_migration.sql`** - Complete faculty dataset
  - **68 faculty members** across 7 departments
  - Complete profiles with images, research areas, publications
  - Profile images stored in `client/src/assets/images/Faculty/[DEPARTMENT]/`
  - Sample user accounts with authentication
  - Production-ready data structure

#### Department Distribution:
- **CSE**: 13 faculty members
- **ECE**: 12 faculty members  
- **EEE**: 10 faculty members
- **MCE**: 11 faculty members
- **CVE**: 10 faculty members
- **HSS**: 4 faculty members
- **APS**: 8 faculty members

### Setup Scripts
- **`scripts/setup-database.sh`** - Automated database setup script
  - Installs MySQL (if needed)
  - Creates database and imports schema
  - Imports seed data
  - Tests connections
  - Provides setup summary

## Quick Setup

To set up the database quickly, run from the project root:

```bash
./scripts/setup-database.sh
```

This will use `database/schemas/schema.sql` and automatically import seed data.

## Manual Setup

### 1. Create Database
```bash
mysql -u root -pMrutyu@2026 -e "CREATE DATABASE IF NOT EXISTS nitgoa_db;"
```

### 2. Import Schema
```bash
mysql -u root -pMrutyu@2026 nitgoa_db < database/schemas/schema.sql
```

### 3. Import Seed Data
```bash
mysql -u root -pMrutyu@2026 nitgoa_db < database/seeds/complete_faculty_data_migration.sql
```

## Usage Guidelines

### For Development
1. Use `faculty_data_migration.sql` for minimal test data
2. Run automated setup script for quick environment setup

### For Production
1. Import only `schema.sql` initially
2. Manually add faculty data through the application
3. Change all default passwords
4. Set up regular backups

### Migration Best Practices
1. Always backup database before running migrations
2. Test migrations on development environment first
3. Migrations should be idempotent (safe to run multiple times)
4. Name new migration files with timestamps: `YYYYMMDD_HHMMSS_description.sql`

## Current Database Structure

The database contains these main tables:
- `users` - User authentication
- `faculty_profiles` - Faculty information
- `faculty_publications` - Faculty publications
- `faculty_awards` - Faculty awards and recognitions
- `faculty_custom_sections` - Custom profile sections
- `faculty_custom_section_items` - Custom section items

## Database Configuration

```env
# Add to your .env file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Mrutyu@2026
DB_NAME=nitgoa_db
DB_PORT=3306
```

## Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@nitgoa.ac.in`

### Sample Faculty Accounts  
- **Username**: `veena.thenkanidiyoor` | **Password**: `faculty123`
- **Username**: `damodar.edla` | **Password**: `faculty123`
- **Username**: `prasenjit.dey` | **Password**: `faculty123`

## Important Notes

- **Security**: Change all default passwords in production
- **Backups**: Set up automated database backups
- **Performance**: Database includes optimized indexes
- **Compatibility**: Designed for MySQL 8.0+
- **Character Encoding**: Full UTF-8 support (utf8mb4)
- **File Organization**: All database files are properly organized in respective folders
- **Documentation**: Comprehensive setup guides available in `docs/database/`

## Troubleshooting

### Common Issues
1. **Connection refused**: Ensure MySQL service is running
2. **Access denied**: Verify username/password in configuration
3. **Unknown database**: Run schema import first
4. **Foreign key errors**: Import files in correct order (schema → migrations → seeds)

### Getting Help
- Check `docs/database/setup-guide.md` for detailed setup instructions
- Review error logs in MySQL
- Ensure proper file permissions on database files
