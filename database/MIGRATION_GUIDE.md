# Faculty Data Migration Guide

This guide explains how to migrate faculty data from JSON files to the database.

## Overview

The migration process will:
1. **Drop all existing faculty data** from the database
2. **Update the database schema** to accommodate all faculty information
3. **Import all faculty data** from JSON files in the `client/src/Views/People-Section/Faculty/FacultyDetails/data` directory

## Database Schema Updates

The updated schema includes comprehensive tables for:

### Core Faculty Information
- **faculty_profiles**: Basic faculty information, contact details, research areas
- **faculty_academic_info**: Educational qualifications (B.E., M.E., Ph.D., etc.)
- **faculty_courses_taught**: UG and PG courses taught by faculty

### Research & Publications
- **faculty_publications**: Journal papers, conference proceedings with impact factors
- **faculty_research_guidance**: Ph.D., M.Tech., B.Tech student guidance
- **faculty_funded_projects**: Research projects and grants

### Professional Activities
- **faculty_awards**: Awards and honors received
- **faculty_memberships**: Professional society memberships
- **faculty_professional_services**: Editorial, reviewing, organizing activities
- **faculty_courses_attended**: Workshops, conferences, training attended
- **faculty_courses_conducted**: Workshops and courses conducted

### Custom Sections
- **faculty_custom_sections**: Additional custom sections
- **faculty_custom_section_items**: Items within custom sections

## Prerequisites

1. **Python 3.6+** installed on your system
2. **MySQL server** running and accessible
3. **Database credentials** (host, username, password)
4. **Faculty JSON files** in the correct directory structure

## Installation & Setup

### Step 1: Install Dependencies

```bash
# Navigate to the database directory
cd database

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Prepare Database

Make sure your MySQL server is running and you have:
- Database name (default: `nitgoa_db`)
- MySQL username (default: `root`)
- MySQL password
- Host (default: `localhost`)

## Running the Migration

### Option 1: Using Python Script (Recommended)

```bash
# Navigate to database directory
cd database

# Run the migration script
python3 migrate_faculty_data.py
```

The script will prompt you for database credentials if they're not set as environment variables.

### Option 2: Using Shell Script (Linux/macOS)

```bash
# Make script executable (if not already)
chmod +x migrate_faculty.sh

# Run the migration
./migrate_faculty.sh
```

### Option 3: Using Batch Script (Windows)

```cmd
REM Navigate to database directory
cd database

REM Run the migration
migrate_faculty.bat
```

## Data Processing Features

The migration script includes sophisticated data processing:

### Publication Parsing
- Extracts publication year and month from citations
- Identifies impact factors (IF: X.XXX)
- Recognizes indexing information (SCI, SCIE, ESCI, Scopus)
- Preserves full citation text

### Research Guidance Processing
- Parses student names from guidance text
- Extracts research topics
- Determines ongoing vs completed status

### Date Processing
- Handles multiple date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
- Converts joining dates and birth dates properly

### Department Mapping
- Automatically maps JSON file locations to departments
- Supports: CSE, ECE, EEE, MCE, CVE, HSS, APS

## Verification

After migration, verify the data by:

1. **Checking record counts**:
   ```sql
   SELECT department, COUNT(*) FROM faculty_profiles GROUP BY department;
   ```

2. **Verifying publications**:
   ```sql
   SELECT COUNT(*) FROM faculty_publications;
   ```

3. **Checking academic information**:
   ```sql
   SELECT COUNT(*) FROM faculty_academic_info;
   ```

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify MySQL server is running
   - Check database credentials
   - Ensure database exists

2. **Import Errors**:
   - Check JSON file format
   - Verify file paths exist
   - Look for encoding issues

3. **Schema Errors**:
   - Ensure proper MySQL privileges
   - Check for conflicting table names

### Logs and Debugging

The script provides detailed output showing:
- Faculty members being processed
- Success/failure status for each file
- Summary statistics at the end

### Recovery

If migration fails:
1. The script uses transactions for each faculty member
2. Failed records won't affect successful ones
3. Re-run the script to retry failed imports
4. Check error messages for specific issues

## Data Structure

### JSON File Organization
```
data/
├── aps_json/          # Applied Sciences faculty
├── cse_json/          # Computer Science faculty
├── cve_json/          # Civil Engineering faculty
├── ece_json/          # Electronics & Communication faculty
├── eee_json/          # Electrical & Electronics faculty
├── hss_json/          # Humanities & Social Sciences faculty
└── mce_json/          # Mechanical Engineering faculty
```

### Supported JSON Fields

The migration script processes all fields found in faculty JSON files:
- Basic profile information
- Contact details
- Academic qualifications
- Research areas and interests
- Courses taught (UG/PG)
- Publications (journals, conferences)
- Research guidance
- Professional activities
- Awards and honors
- Memberships
- Courses attended/conducted

## Post-Migration

After successful migration:

1. **Update application configuration** to use the new schema
2. **Test faculty profile pages** to ensure data displays correctly
3. **Verify search functionality** works with new data structure
4. **Check image paths** and update if necessary
5. **Update API endpoints** to match new table structure

## Security Notes

- Database credentials are only stored temporarily during execution
- Use environment variables for production deployments
- Ensure proper database user privileges
- Consider setting up read-only database users for application access

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify JSON file formats match expected structure
3. Ensure database connectivity and permissions
4. Review the migration script for any path issues
