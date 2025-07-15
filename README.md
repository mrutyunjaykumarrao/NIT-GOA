# NIT Goa Official Website

[![Build Status](https://img.shields.io/badge/build-in%20development-yellow.svg)](https://github.com/mrutyunjaykumarrao/NIT-GOA)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, full-stack web application for the National Institute of Technology, Goa. Built with React.js frontend, Node.js/Express backend, and MySQL database with role-based authentication and admin dashboard.

🌐 **Live Demo**: [https://nit-goa-ac-in.web.app](https://nit-goa-ac-in.web.app)  
📚 **Documentation**: [Complete Docs](./docs/README.md)

## 🏗️ Project Architecture

```
nitgoa/
├── 📁 client/                    # React.js Frontend
│   ├── src/
│   │   ├── Views/               # Pages (Home, Faculty, Admin Dashboard)
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # Auth, Theme contexts
│   │   └── services/            # API integration
│   └── public/                  # Static assets
│
├── 📁 server/                    # Node.js/Express Backend  
│   ├── src/
│   │   ├── controllers/         # API route handlers
│   │   ├── models/              # Database models
│   │   ├── routes/              # RESTful API routes
│   │   ├── middleware/          # Auth & validation
│   │   └── services/            # Business logic
│   └── server.js                # Server entry point
│
├── 📁 database/                  # MySQL Database
│   ├── migrations/              # Schema changes
│   ├── seeds/                   # Initial data
│   └── schemas/                 # Database design
│
├── 📁 shared/                    # Shared utilities
│   ├── constants/               # User roles, API endpoints
│   └── utils/                   # Helper functions
│
└── 📁 docs/                      # Documentation
    ├── development/             # Setup guides
    ├── api/                     # API documentation
    └── database/                # DB documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+
- **MySQL** 8.0+
- **npm** or **yarn**

### Installation & Setup
```bash
# 1. Clone repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd nitgoa

# 2. Install all dependencies
npm run install-all

# 3. Setup environment variables
cp .env.example .env
cp client/.env.example client/.env.local  
cp server/.env.example server/.env

# 4. Configure database
mysql -u root -p
CREATE DATABASE nitgoa_db;

# 5. Start development servers
npm run dev
```

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:3001

## 🎯 Key Features

### 🎨 **User Experience**
- **📱 Responsive Design** - Optimized for all devices
- **🌙 Theme Switching** - Light/Dark mode support
- **⚡ Fast Loading** - Optimized performance
- **🎛️ Intuitive Navigation** - Easy menu structure

### 🔐 **Authentication System**
- **👤 Role-Based Access** - Faculty, Admin, Student roles
- **🔒 Secure Login** - JWT-based authentication
- **🛡️ Protected Routes** - Role-specific access control
- **👨‍🏫 Faculty Profiles** - Faculty can edit own profiles

### 🛠️ **Admin Dashboard**
- **📊 Content Management** - Hero images, notices, PDFs
- **👥 User Management** - Create/edit faculty accounts
- **📁 File Management** - Upload/delete files
- **⚡ Real-time Updates** - Changes reflect immediately
- **📈 Analytics** - Website statistics and insights

### 📚 **Content Features**
- **🏫 Comprehensive Pages** - About, Academics, Admissions, Faculty
- **📢 Notice Management** - Dynamic announcements system
- **👨‍🎓 Faculty Directory** - Searchable faculty profiles
- **📄 Document Management** - PDF uploads and downloads

## 🛠️ Technology Stack

### Frontend
- **React.js 19** - Modern UI library
- **React Router 7** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Modern styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### DevOps & Hosting
- **Firebase Hosting** - Frontend deployment
- **PM2** - Process management
- **Nginx** - Reverse proxy
- **Cloudinary** - Image storage

## 📁 Available Scripts

### Root Level
```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both frontend & backend
npm run build         # Build for production
npm test             # Run all tests
npm run deploy       # Deploy to production
```

### Frontend (client/)
```bash
npm start            # Development server
npm run build        # Production build
npm test            # Run tests
npm run lint        # Code linting
```

### Backend (server/)
```bash
npm run dev         # Development with nodemon
npm start          # Production server
npm test          # API tests
npm run lint      # Code linting
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

### Faculty Management
- `GET /api/faculty` - List all faculty
- `GET /api/faculty/:id` - Faculty details
- `PUT /api/faculty/:id` - Update profile (own only)

### Admin Operations
- `GET /api/admin/dashboard` - Dashboard data
- `POST /api/admin/faculty` - Create faculty account
- `PUT /api/admin/faculty/:id` - Update any faculty
- `DELETE /api/admin/faculty/:id` - Delete faculty

### Content Management
- `GET /api/content/hero-images` - Hero images
- `POST /api/content/notices` - Add notices
- `POST /api/upload/image` - Upload files

## 📚 Documentation

- **[📖 Complete Documentation](./docs/README.md)** - Full documentation hub
- **[⚛️ Frontend Guide](./client/README.md)** - React.js setup & features
- **[🔧 Backend Guide](./server/README.md)** - Node.js API documentation
- **[🗄️ Database Guide](./docs/database/)** - Schema & migrations
- **[🚀 Deployment Guide](./docs/deployment/)** - Production setup

## 🎨 Current Features

### ✅ **Implemented**
- **Frontend Structure** - 18+ pages with responsive design
- **Hero Carousel** - Auto-cycling campus images
- **Faculty Directory** - Comprehensive faculty listing with filtering
- **Navigation System** - React Router with protected routes
- **Project Structure** - Organized client/server architecture
- **Development Setup** - Both frontend and backend running
- **API Foundation** - Express server with route structure

### 🔄 **In Development**
- **Backend API** - Express.js server with MySQL integration
- **Authentication** - JWT-based login system
- **Admin Dashboard** - Content management interface
- **Database Schema** - User, Faculty, Content models
- **File Upload** - Image and document handling

### 📋 **Planned**
- **Real-time Updates** - Live content synchronization
- **Email Notifications** - User management emails
- **Advanced Search** - Faculty and content search
- **Mobile App** - React Native companion app
- **Analytics Dashboard** - Usage statistics

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines
- Follow existing code structure
- Write tests for new features
- Update documentation
- Follow naming conventions

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

## 👥 Team

**NIT Goa Development Team**
- **Lead Developer**: [Mrutyunjay Kumar Rao](https://github.com/mrutyunjaykumarrao)
- **Project**: Official NIT Goa Website
- **Branch**: `backend-mysql-implementation`

## 🐛 Bug Reports & 💡 Feature Requests

- **Issues**: [GitHub Issues](https://github.com/mrutyunjaykumarrao/NIT-GOA/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mrutyunjaykumarrao/NIT-GOA/discussions)
- **Email**: development@nitgoa.ac.in

## 📞 Support

For technical support or questions:
- 📧 **Email**: support@nitgoa.ac.in
- 📱 **GitHub**: [Create an Issue](https://github.com/mrutyunjaykumarrao/NIT-GOA/issues)
- 📖 **Docs**: [Documentation Hub](./docs/README.md)

---

**🎓 Built with ❤️ for NIT Goa | 🚀 Empowering Education Through Technology**