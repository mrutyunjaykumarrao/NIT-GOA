# Database Setup Guide for Faculty Management System

## Prerequisites

This guide assumes you have:
- Node.js and npm installed
- Homebrew installed (for macOS)
- Admin access to install MySQL

## Step 1: Install MySQL

### Option A: Using Homebrew (Recommended for macOS)

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation (optional but recommended)
mysql_secure_installation
```

### Option B: Using MySQL Installer
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### Option C: Using Docker (Alternative)
```bash
# Run MySQL in Docker container
docker run --name faculty-mysql -e MYSQL_ROOT_PASSWORD=root123 -p 3306:3306 -d mysql:8.0

# Access MySQL shell in container
docker exec -it faculty-mysql mysql -uroot -p
```

## Step 2: Create Database and User

### Connect to MySQL as root:
```bash
mysql -u root -p
```

### Create database and user:
```sql
-- Create the database
CREATE DATABASE faculty_management;

-- Create a dedicated user for the application
CREATE USER 'faculty_user'@'localhost' IDENTIFIED BY 'faculty_pass123';

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
