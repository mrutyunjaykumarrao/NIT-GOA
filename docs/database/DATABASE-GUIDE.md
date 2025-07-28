# NIT GOA Database Guide (Version 2.0)

## Overview
The NIT GOA project supports both the original `nitgoa_db` and the enhanced `updated_nitgoa` databases. This guide covers both configurations and the switching mechanism.

## 🗄️ Database Configurations

### Original Database (nitgoa_db)
- **Purpose**: Legacy database with existing data
- **Tables**: 17 tables
- **Features**: Basic faculty and staff management
- **Schema**: Traditional structure with separate tables
- **Compatibility**: Full compatibility with backend-mysql-implementation branch

### Enhanced Database (updated_nitgoa)  
- **Purpose**: Advanced database with enhanced features
- **Tables**: 18 tables with improved relationships
- **Features**: Audit logs, file attachments, hierarchical data, advanced security
- **Schema**: Modern structure with proper foreign keys and constraints
- **Compatibility**: Optimized for updated-database branch

## 🔄 Database Switching

### Automated Switching (Recommended)
Use the database switcher utility:

```bash
# Check current database
cd server && node switch-database.js status

# Switch to original database (nitgoa_db)
cd server && node switch-database.js original

# Switch to enhanced database (updated_nitgoa)  
cd server && node switch-database.js updated

# Test database connection after switching
cd server && node test-db.js
```

### Manual Configuration
Edit `server/.env` file:
```bash
# For original database
DB_NAME=nitgoa_db

# For enhanced database
DB_NAME=updated_nitgoa
```

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js and npm installed
- MySQL 8.0+ installed and running
- Git repository cloned

### 2. Database Creation
```bash
# Create original database
mysql -u root -p -e "CREATE DATABASE nitgoa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create enhanced database
mysql -u root -p -e "CREATE DATABASE updated_nitgoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Schema Setup
```bash
# For enhanced database only (original has existing data)
mysql -u root -p updated_nitgoa < database/schemas/updated_nitgoa_schema.sql
```

### 4. Environment Configuration
```bash
# Copy environment template
cp server/.env.example server/.env

# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root  
# DB_PASSWORD=your_password
# DB_NAME=nitgoa_db  # or updated_nitgoa
# DB_PORT=3306
```

### 5. Install Dependencies & Start
```bash
# Install server dependencies
cd server && npm install

# Test database connection
node test-db.js

# Start server
npm start

# Or start full stack
cd .. && npm run dev
```

## 📊 Database Schema Details

### Enhanced Database Tables (updated_nitgoa)
1. `user_accounts` - Authentication and user management
2. `departments` - College departments with hierarchy
3. `designations` - Job titles and levels
4. `courses` - Course catalog
5. `research_areas` - Hierarchical research areas
6. `employees` - Master employee table
7. `faculty_profiles` - Faculty-specific information
8. `staff_profiles` - Administrative/technical staff
9. `faculty_education` - Educational qualifications
10. `faculty_publications` - Research publications
11. `faculty_generic_sections` - Flexible content sections
12. `faculty_custom_sections` - User-defined sections
13. `faculty_custom_section_entries` - Custom section data
14. `faculty_courses_taught` - Teaching assignments
15. `faculty_research_areas` - Research specializations
16. `system_settings` - Application configuration
17. `audit_log` - Change tracking
18. `file_attachments` - Document management

### Original Database Tables (nitgoa_db)
1. `users` - Basic user authentication
2. `faculty_profiles` - Faculty information
3. `faculty_profiles_short` - Summary profiles
4. `faculty_academic_info` - Educational background
5. `faculty_publications` - Research publications
6. `faculty_awards` - Awards and honors
7. `faculty_memberships` - Professional memberships
8. `faculty_professional_services` - Service activities
9. `faculty_funded_projects` - Research projects
10. `faculty_research_guidance` - Student guidance
11. `faculty_courses_taught` - Teaching assignments
12. `faculty_courses_attended` - Training courses
13. `faculty_courses_conducted` - Conducted training
14. `faculty_custom_sections` - Custom sections
15. `faculty_custom_section_items` - Custom section data
16. `administrative_staff` - Administrative personnel
17. `technical_staff` - Technical personnel

## 🔧 API Endpoints

### Health & Status
- `GET /api/health` - Server health check
- `GET /api/test-db` - Database connection test

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Faculty Management
- `GET /api/faculty` - List all faculty
- `GET /api/faculty/:id` - Get faculty details
- `POST /api/faculty` - Create faculty (admin)
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Remove faculty (admin)

### Staff Management
- `GET /api/staff/administrative` - Administrative staff
- `GET /api/staff/technical` - Technical staff
- `GET /api/staff/:id` - Staff details

### Public Data
- `GET /api/public/departments` - Department list
- `GET /api/public/faculty` - Public faculty profiles

## 🔒 Security Features

### Enhanced Database Security
- Account locking after failed login attempts
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Comprehensive audit logging
- Rate limiting on API endpoints

### Original Database Security
- Basic password hashing
- Simple user authentication
- Session-based access control

## 🛠️ Troubleshooting

### Common Issues
1. **Database Connection Fails**
   - Check MySQL service: `brew services list | grep mysql`
   - Verify credentials in `.env` file
   - Test connection: `mysql -u root -p`

2. **Missing Tables Error**
   - Run schema setup: `mysql -u root -p database_name < schema_file.sql`
   - Check database exists: `SHOW DATABASES;`

3. **Server Won't Start**
   - Check port availability: `lsof -i :3001`
   - Verify environment variables
   - Check logs: `npm start`

4. **Schema Mismatch Errors**
   - Ensure correct database is selected
   - Run database test: `node test-db.js`
   - Use correct branch for database version

### Database Switching Issues
- Always restart server after switching: `npm start`
- Test connection after switch: `node test-db.js`
- Check environment file: `cat .env | grep DB_NAME`

## 📚 Additional Resources

- **Server Documentation**: `server/README.md`
- **Development Setup**: `docs/development/DEVELOPMENT_SETUP_GUIDE.md`
- **API Documentation**: Available at `http://localhost:3001/api/docs`
- **Database Switching Guide**: Use `node switch-database.js` utility

## 🎯 Branch-Database Mapping

| Branch | Recommended Database | Status |
|--------|---------------------|---------|
| `backend-mysql-implementation` | `nitgoa_db` | ✅ Active |
| `updated-database` | `updated_nitgoa` | ✅ Enhanced |
| `main` | `nitgoa_db` | ✅ Stable |

## 📞 Support

For database-related issues:
1. Check this guide first
2. Run `node test-db.js` for diagnostics
3. Use `node switch-database.js status` to check configuration
4. Review server logs for specific errors
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
mysql -u root -pMrutyu@2026 -e "CREATE DATABASE IF NOT EXISTS updated_nitgoa;"
```

### 2. Import Schema
```bash
mysql -u root -pMrutyu@2026 updated_nitgoa < database/schemas/updated_nitgoa_schema.sql
```

### 3. Import Seed Data
```bash
mysql -u root -pMrutyu@2026 updated_nitgoa < database/seeds/complete_faculty_data_migration.sql (deprecated)
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
DB_NAME=updated_nitgoa
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
