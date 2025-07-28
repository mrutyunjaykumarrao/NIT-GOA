# Quick Database Setup Guide

## 🚀 One-Command Setup

For quick development setup, choose your database and follow these commands:

### Option 1: Original Database (Recommended for stable development)
```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE nitgoa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Configure environment  
cd server
cp .env.example .env
# Edit .env: Set DB_NAME=nitgoa_db and add your MySQL password

# 3. Switch to original database
node switch-database.js original

# 4. Test & start
node test-db.js
npm install && npm start
```

### Option 2: Enhanced Database (For new features)
```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE updated_nitgoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import schema
mysql -u root -p updated_nitgoa < ../database/schemas/updated_nitgoa_schema.sql

# 3. Configure environment
cd server  
cp .env.example .env
# Edit .env: Set DB_NAME=updated_nitgoa and add your MySQL password

# 4. Switch to enhanced database
node switch-database.js updated

# 5. Test & start
node test-db.js
npm install && npm start
```

## 🔄 Database Switching

Already have both databases? Switch between them easily:

```bash
cd server

# Check current database
node switch-database.js status

# Switch to original (nitgoa_db)  
node switch-database.js original

# Switch to enhanced (updated_nitgoa)
node switch-database.js updated

# Always test after switching
node test-db.js

# Restart server
npm start
```

## ⚡ Prerequisites

### Install MySQL (Choose one)

**Option A: Homebrew (macOS)**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation  # Optional security setup
```

**Option B: Direct Download**
- Download from https://dev.mysql.com/downloads/mysql/
- Follow installation wizard
- Remember your root password

**Option C: Docker**
```bash
docker run --name nitgoa-mysql -e MYSQL_ROOT_PASSWORD=root123 -p 3306:3306 -d mysql:8.0
```

### Install Node.js
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

## 🔧 Environment Configuration

Edit `server/.env` file with your settings:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=nitgoa_db  # or updated_nitgoa
DB_PORT=3306

# JWT Configuration  
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🎯 Verification Steps

After setup, verify everything works:

```bash
# 1. Test database connection
cd server && node test-db.js

# 2. Check server health
npm start &
curl http://localhost:3001/api/health

# 3. Test API endpoints
curl http://localhost:3001/api/faculty
curl http://localhost:3001/api/staff/administrative

# 4. Access web interface (if client is running)
# Open http://localhost:3000
```

## 🚨 Troubleshooting

**Database connection fails?**
```bash
# Check MySQL is running
brew services list | grep mysql  # macOS
sudo service mysql status        # Linux

# Test direct connection
mysql -u root -p

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

**Server won't start?**
```bash
# Check if port is in use
lsof -i :3001

# Kill existing processes
npm run cleanup-ports

# Check logs
npm start  # Look for error messages
```

**Schema errors?**
```bash
# Ensure correct database is selected
node switch-database.js status

# Re-import schema (enhanced DB only)
mysql -u root -p updated_nitgoa < ../database/schemas/updated_nitgoa_schema.sql

# Check table structure
mysql -u root -p -e "USE nitgoa_db; SHOW TABLES;"
```

## 📚 Next Steps

- Read the full guide: `docs/database/DATABASE-GUIDE.md`
- Development setup: `docs/development/DEVELOPMENT_SETUP_GUIDE.md`
- API documentation: Available at `http://localhost:3001/api/docs`
- Team guide: `docs/development/SIMPLE_TEAM_GUIDE.md`

-- Grant privileges
GRANT ALL PRIVILEGES ON faculty_management.* TO 'faculty_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

## Step 3: Import Database Schema

```bash
# Navigate to the project directory
cd /Users/mrutyunjaykumarrao/Desktop/Faculty_LoginPage

# Import the schema
mysql -u faculty_user -p faculty_management < database/schema.sql
```

## Step 4: Update Backend Configuration

The backend is already configured with these default settings in `server.js`:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'faculty_user',
  password: 'faculty_pass123',
  database: 'faculty_management'
};
```

## Step 5: Test Database Connection

Run the backend server and check the console for connection status:

```bash
cd backend
npm start
```

You should see: "Connected to MySQL database"

## Default Login Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Faculty Accounts
- Username: `john.smith`, Password: `faculty123`
- Username: `sarah.johnson`, Password: `faculty123`
- Username: `michael.brown`, Password: `faculty123`

## Troubleshooting

### MySQL Connection Issues

1. **Check MySQL service status:**
   ```bash
   brew services list | grep mysql
   ```

2. **Restart MySQL service:**
   ```bash
   brew services restart mysql
   ```

3. **Check if MySQL is running on port 3306:**
   ```bash
   lsof -i :3306
   ```

4. **Test database connection:**
   ```bash
   mysql -u faculty_user -p faculty_management
   ```

### Common Issues

1. **"Access denied for user"**: Check username/password in backend configuration
2. **"Can't connect to MySQL server"**: Ensure MySQL service is running
3. **"Unknown database"**: Make sure you've created the database and imported the schema
4. **Port conflicts**: Check if another service is using port 3306

### Backend Environment Variables (Optional)

For production, create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=faculty_user
DB_PASSWORD=faculty_pass123
DB_NAME=faculty_management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

Then update `server.js` to use environment variables:

```javascript
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'faculty_user',
  password: process.env.DB_PASSWORD || 'faculty_pass123',
  database: process.env.DB_NAME || 'faculty_management'
};
```

## Quick Setup Script

For a one-command setup, run:

```bash
./setup-database.sh
```

This script will:
1. Install MySQL via Homebrew
2. Start MySQL service
3. Create database and user
4. Import schema
5. Test connection
