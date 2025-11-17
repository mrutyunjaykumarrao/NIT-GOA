# Database Setup Guide for Team Members

This guide will help you set up the exact database structure and data for the NIT Goa project.

## Prerequisites

- MySQL installed on your system
- MySQL server running
- Git repository cloned

## Setup Steps

### 1. Create MySQL Database

Open your MySQL client and create the database:

```sql
CREATE DATABASE updated_nitgoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Environment Variables

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Copy the `.env.example` file to `.env` (or create a new `.env` file):
   ```bash
   cp .env.example .env  # if .env.example exists
   # OR
   touch .env
   ```

3. Add your database configuration to `server/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=updated_nitgoa
   DB_PORT=3306
   ```

### 3. Restore Database from Backup

**Option A: Using the restore script (Recommended)**

1. Make sure you have the latest backup file in `database/backups/`

2. Run the restore script:
   ```bash
   cd /path/to/nitgoa
   ./scripts/restore-database.sh
   ```

3. Select the most recent backup when prompted

**Option B: Manual MySQL Import**

If the restore script doesn't work, you can manually import:

```bash
cd database/backups
mysql -u root -p updated_nitgoa < nitgoa_backup_YYYYMMDD_HHMMSS.sql
```

Replace `YYYYMMDD_HHMMSS` with the actual backup filename timestamp.

### 4. Verify Database Setup

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Check the database:
   ```sql
   USE updated_nitgoa;
   SHOW TABLES;
   ```

You should see all the tables populated with data.

### 5. Install Dependencies and Start Server

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

3. Start the development environment:
   ```bash
   cd ..
   ./scripts/dev.sh  # For macOS/Linux
   # OR
   ./scripts/dev.bat  # For Windows
   ```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql --version`
- Check your credentials in `server/.env`
- Ensure the database name matches: `updated_nitgoa`

### Permission Issues on Scripts

If scripts don't execute, make them executable:
```bash
chmod +x scripts/*.sh
```

### Import Errors

If you get errors during import:
1. Check MySQL version compatibility
2. Ensure you have sufficient privileges
3. Try importing with `--force` flag:
   ```bash
   mysql -u root -p --force updated_nitgoa < backup_file.sql
   ```

## Need Help?

If you encounter any issues during setup, please contact the team lead or check the main README.md for additional documentation.
