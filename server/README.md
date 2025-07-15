# NIT Goa Website - Backend Server

This is the Node.js/Express backend API for the NIT Goa official website.

## Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation
```bash
cd server
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure database credentials
3. Set JWT secret
4. Configure email settings (optional)

### Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE nitgoa_db;

# Run migrations (once implemented)
npm run migrate
```

### Development
```bash
npm run dev
```
The API will run on http://localhost:5000

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/:id` - Get faculty details
- `PUT /api/faculty/:id` - Update faculty profile

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard data
- `POST /api/admin/faculty` - Create faculty
- `PUT /api/admin/faculty/:id` - Update any faculty
- `DELETE /api/admin/faculty/:id` - Delete faculty

### Content Management
- `GET /api/content/hero-images` - Get hero images
- `POST /api/content/hero-images` - Add hero image
- `GET /api/content/notices` - Get notices
- `POST /api/content/notices` - Add notice

### File Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/document` - Upload document
- `DELETE /api/upload/:fileId` - Delete file

## Security Features
- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS protection
