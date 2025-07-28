# NIT GOA Database Guide (Updated Version 2.0)

## Overview
The NIT GOA project now uses the **updated_nitgoa** database with an enhanced 18-table schema designed for optimal performance and comprehensive faculty management.

## Database Information
- **Database Name**: `updated_nitgoa`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Tables**: 18 tables with proper relationships and constraints
- **Version**: 2.0 (Enhanced Schema)

## Quick Setup

### 1. Create Database
```bash
mysql -u root -p -e "CREATE DATABASE updated_nitgoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Import Schema
```bash
mysql -u root -p updated_nitgoa < database/schemas/updated_nitgoa_schema.sql
```

### 3. Configure Environment
```bash
# Copy environment file
cp server/.env.example server/.env

# Update with your credentials
DB_NAME=updated_nitgoa
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

### 4. Start Server
```bash
cd server
npm install
npm run dev
```

## Database Schema Tables

### Core Tables
1. **user_accounts** - System user authentication
2. **departments** - Academic departments
3. **designations** - Faculty designations
4. **employees** - All staff and faculty members
5. **courses** - Academic courses
6. **research_areas** - Research specializations

### Faculty Management
7. **faculty_profiles** - Extended faculty information
8. **faculty_education** - Educational background
9. **faculty_publications** - Research publications
10. **faculty_generic_sections** - Custom profile sections
11. **faculty_custom_sections** - User-defined sections
12. **faculty_custom_section_entries** - Section content
13. **faculty_courses_taught** - Teaching assignments
14. **faculty_research_areas** - Research affiliations

### Support Tables
15. **staff_profiles** - Non-faculty staff
16. **system_settings** - Application configuration
17. **audit_log** - System activity tracking
18. **file_attachments** - Document management

## API Endpoints

### Public Access
- `GET /api/public/departments` - List all departments
- `GET /api/public/faculty` - Public faculty directory
- `GET /api/public/faculty/:id` - Faculty profile details

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Password change
- `GET /api/auth/profile` - User profile

### Faculty Management (Authenticated)
- `GET /api/faculty/my-profile` - Own profile
- `PUT /api/faculty/my-profile` - Update profile
- `GET /api/faculty/my-publications` - Own publications
- `POST /api/faculty/publications` - Add publication

### System
- `GET /api/health` - System health check
- `GET /api/test-db` - Database connectivity
- `GET /api/docs` - API documentation

## Default Users

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

> **Note**: Change the default admin password immediately after setup!

## Backup and Maintenance

### Create Backup
```bash
mysqldump -u root -p updated_nitgoa > backup_$(date +%Y%m%d).sql
```

### Schema-only Backup
```bash
mysqldump -u root -p --no-data updated_nitgoa > schema_backup_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
mysql -u root -p updated_nitgoa < backup_file.sql
```

## Security Features

1. **JWT Authentication** - Secure token-based access
2. **Rate Limiting** - DDoS protection
3. **Account Locking** - Brute force protection
4. **Audit Logging** - Complete activity tracking
5. **Password Hashing** - Bcrypt encryption
6. **CORS Protection** - Cross-origin security

## Migration from Old Database

If you have an old `nitgoa_db` database, it has been completely replaced with `updated_nitgoa`. The new schema provides:
- Enhanced data relationships
- Better performance
- Comprehensive audit logging
- Flexible custom sections
- Improved security

## Troubleshooting

### Database Connection Issues
1. Verify MySQL service is running
2. Check credentials in `.env` file
3. Ensure database exists
4. Test with: `curl http://localhost:3001/api/test-db`

### Schema Issues
1. Drop and recreate database if needed
2. Re-import from `updated_nitgoa_schema.sql`
3. Check server logs for specific errors

### Performance
- Database includes proper indexes
- Connection pooling enabled
- Query optimization built-in

## Development Guidelines

1. **Always use the new schema** - `updated_nitgoa`
2. **Use the API endpoints** - Don't query database directly from frontend
3. **Follow authentication** - Use JWT tokens for protected routes
4. **Audit logging** - All changes are automatically logged

## Contact & Support

For database issues or questions:
1. Check API documentation: `GET /api/docs`
2. Review server logs for errors
3. Verify database connectivity: `GET /api/test-db`

---

**Version**: 2.0  
**Last Updated**: July 28, 2025  
**Database**: updated_nitgoa  
**Schema File**: `database/schemas/updated_nitgoa_schema.sql`
