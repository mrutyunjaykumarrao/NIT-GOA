# NIT Goa Backend API

A comprehensive backend API for the NIT Goa website built with Node.js, Express, and MySQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access (Admin/Faculty)
- **Faculty Management**: Complete CRUD operations for faculty profiles
- **File Upload**: Image upload functionality for faculty profiles
- **Database Integration**: MySQL with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v14+ recommended)
- MySQL (v8.0+ recommended)
- npm or yarn

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE nitgoa_db;
```

2. Run the schema setup:
```bash
mysql -u root -p nitgoa_db < ../database/schemas/schema.sql
```

3. Run the faculty data migration:
```bash
mysql -u root -p nitgoa_db < ../database/seeds/complete_faculty_data_migration.sql
```

### 4. Environment Configuration

Configure the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nitgoa_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 5. Test Database Connection

```bash
npm run test:db
```

### 6. Start the Development Environment

Use the main development script from the project root:

```bash
# From the project root directory (/Users/mrutyunjaykumarrao/nitgoa)
./scripts/dev.sh
```

This will automatically:
- Clean up any processes on ports 3000 and 3001
- Install dependencies if needed
- Start both frontend (port 3000) and backend (port 3001) servers

You can also start just the backend:
```bash
./scripts/dev.sh server
```

Or use individual npm scripts if needed:
```bash
# Backend only
cd server && npm run dev

# Frontend only  
cd client && npm start
```

## 📚 API Documentation

### Base URL: `http://localhost:3001/api`

### 🔐 Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 👥 Faculty Management

#### Get All Faculty (Public)
```http
GET /api/faculty
GET /api/faculty?department=CSE
```

#### Get Faculty by Department
```http
GET /api/faculty/department/CSE
```

#### Get Single Faculty
```http
GET /api/faculty/1
```

### 🛡️ Admin Operations (Requires Admin Token)

#### Get All Faculty (Admin View)
```http
GET /api/admin/faculty
Authorization: Bearer jwt_token_here
```

#### Create Faculty
```http
POST /api/admin/faculty
Authorization: Bearer jwt_token_here
```

### 📤 File Upload

#### Upload Faculty Image
```http
POST /api/upload/image
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

### 🔍 Health Check

```http
GET /api/health
GET /api/test-db
```

## 🔧 Available Scripts

**Recommended (from project root):**
- `./scripts/dev.sh` - Start both frontend and backend servers
- `./scripts/dev.sh server` - Start only backend server
- `./scripts/dev.sh client` - Start only frontend server
- `./scripts/dev.sh stop` - Stop all development servers

**Individual backend scripts:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run test:db` - Test database connection and setup
- `npm test` - Run tests
- `npm run lint` - Lint code

## 🛡️ Security Features

- JWT Authentication
- Role-based Access Control
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- SQL Injection Protection

## 📊 Database Schema

Main tables:
- **users**: User accounts and authentication
- **faculty_profiles**: Faculty information and profiles
- **faculty_publications**: Faculty publications
- **faculty_awards**: Faculty awards

## 🚨 Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 👥 Contributors

NIT Goa Development Team
