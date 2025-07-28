# NIT Goa Official Website

[![Build Status](https://img.shields.io/badge/build-in%20development-yellow.svg)](https://github.com/mrutyunjaykumarrao/NIT-GOA)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, full-stack web application for the National Institute of Technology, Goa. Built with React.js frontend, Node.js/Express backend, and MySQL database with role-based authentication and admin dashboard.

🌐 **Live Demo**: [https://nit-goa-ac-in.web.app](https://nit-goa-ac-in.web.app)  
📚 **Documentation**: [Complete Docs](./docs/README.md) | 🗄️ **Database Guide**: [Database Setup](./docs/database/DATABASE-GUIDE.md)

## 🏗️ Project Architecture

```
nitgoa/
├── 📁 client/                    # React.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 Views/            # Page components (18 pages)
│   │   │   ├── Home-Section/    # Homepage with hero carousel
│   │   │   ├── About/           # Institute information
│   │   │   ├── Academics-Section/ # Academic programs
│   │   │   ├── Admission-Section/ # Admission details
│   │   │   ├── Faculty/         # Faculty directory with filtering
│   │   │   ├── Campus-Life/     # Campus facilities & activities
│   │   │   ├── Placement/       # Placement statistics
│   │   │   ├── Research/        # Research areas & publications
│   │   │   ├── ContactUs/       # Contact information
│   │   │   ├── Facilities/      # Infrastructure details
│   │   │   ├── GIAN/           # Global Initiative programs
│   │   │   ├── NIRF/           # Ranking information
│   │   │   ├── Outreach-Activities/ # Community programs
│   │   │   ├── RTI/            # Right to Information
│   │   │   ├── Tenders/        # Procurement information
│   │   │   ├── Academic-Calendar/ # Important dates
│   │   │   └── Dashboard/       # Admin dashboard (planned)
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── 📁 Navbar/       # Enhanced navigation with margins
│   │   │   ├── 📁 Footer/       # Refactored with footer- prefix classes
│   │   │   ├── 📁 Auth/         # Login/authentication components (planned)
│   │   │   ├── 📁 Dashboard/    # Admin dashboard components (planned)
│   │   │   └── 📁 Faculty/      # Faculty-specific components
│   │   ├── 📁 contexts/         # React contexts
│   │   │   ├── ThemeContext.js  # Dark/Light theme management
│   │   │   ├── AuthContext.js   # Authentication state (planned)
│   │   │   └── DashboardContext.js # Admin dashboard state (planned)
│   │   ├── 📁 services/         # API integration
│   │   │   ├── authService.js   # Login/logout API calls (planned)
│   │   │   ├── facultyService.js # Faculty CRUD operations (planned)
│   │   │   ├── contentService.js # Content management APIs (planned)
│   │   │   └── uploadService.js  # File upload APIs (planned)
│   │   ├── 📁 utils/           # Utility functions
│   │   │   ├── navigationConfig.js # Centralized navigation
│   │   │   ├── permissions.js   # Role permission checks (planned)
│   │   │   └── constants.js     # Frontend constants
│   │   └── 📁 assets/          # Images and media assets
│   │       ├── 📁 images/       # Organized image assets
│   │       └── 📁 icons/        # Icon assets
│   ├── 📁 public/              # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── NIT_LOGO.png
│   │   ├── 📁 images/          # Campus images, logos
│   │   └── 📁 pdf/             # Document files
│   ├── package.json            # Frontend dependencies
│   ├── .env.local             # Frontend environment variables
│   └── README.md              # Frontend documentation
│
├── 📁 server/                  # Node.js/Express Backend  
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # API route handlers
│   │   │   ├── authController.js # Authentication logic
│   │   │   ├── facultyController.js # Faculty CRUD + profile updates
│   │   │   ├── adminController.js # Admin-only operations
│   │   │   ├── contentController.js # Content management
│   │   │   └── uploadController.js # File upload handling
│   │   ├── 📁 models/          # Database models
│   │   │   ├── User.js         # Users with roles (faculty/admin)
│   │   │   ├── Faculty.js      # Faculty profiles
│   │   │   ├── Content.js      # Hero images, notices
│   │   │   └── File.js         # Uploaded files metadata
│   │   ├── 📁 routes/          # RESTful API routes
│   │   │   ├── auth.js         # Authentication endpoints
│   │   │   ├── faculty.js      # Faculty management
│   │   │   ├── admin.js        # Admin-only routes
│   │   │   ├── content.js      # Content management
│   │   │   └── upload.js       # File uploads
│   │   ├── 📁 middleware/      # Auth & validation
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── roleCheck.js    # Role-based access control
│   │   │   ├── ownership.js    # Faculty ownership validation
│   │   │   └── upload.js       # File upload middleware
│   │   ├── 📁 services/        # Business logic
│   │   │   ├── emailService.js # Email notifications
│   │   │   ├── fileUploadService.js # File handling
│   │   │   └── notificationService.js # User notifications
│   │   ├── 📁 config/          # Configuration
│   │   │   ├── database.js     # Database connection
│   │   │   ├── cloudinary.js   # Image storage config
│   │   │   └── jwt.js          # JWT configuration
│   │   └── 📁 utils/           # Helper functions
│   │       ├── validators.js   # Input validation
│   │       ├── helpers.js      # Utility functions
│   │       └── constants.js    # Backend constants
│   ├── server.js               # Server entry point
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Backend environment variables
│   └── README.md               # Backend documentation
│
├── 📁 database/                # MySQL Database
│   ├── 📁 migrations/          # Schema changes
│   │   ├── 001_create_users_table.sql # Users with roles
│   │   ├── 002_create_faculty_profiles.sql # Faculty data
│   │   ├── 003_create_content_table.sql # Content management
│   │   └── 004_create_files_table.sql # File metadata
│   ├── 📁 seeds/               # Initial data
│   │   ├── admin_user.sql      # Default admin account
│   │   ├── sample_faculty.sql  # Sample faculty data
│   │   └── departments.sql     # Department structure
│   ├── 📁 schemas/             # Database design
│   │   ├── schema.sql          # Complete schema
│   │   └── relationships.md    # Database relationships
│   └── 📁 backups/             # Database backups
│
├── 📁 shared/                  # Shared utilities
│   ├── 📁 constants/           # Shared constants
│   │   └── index.js            # USER_ROLES, API_ENDPOINTS, FILE_TYPES
│   ├── 📁 types/               # TypeScript interfaces (planned)
│   └── 📁 utils/               # Helper functions
│       ├── validation.js       # Shared validation logic
│       └── formatting.js       # Data formatting utilities
│
├── 📁 docs/                    # Documentation
│   ├── 📁 development/         # Setup guides
│   │   ├── DEVELOPMENT_SETUP_GUIDE.md # Complete setup
│   │   ├── DEVELOPMENT_SCRIPTS_GUIDE.md # Script usage
│   │   ├── TEAM_REFERENCE_GUIDE.md # Team workflow
│   │   ├── SIMPLE_TEAM_GUIDE.md # Beginner guide
│   │   └── QUICK_REFERENCE.md  # Daily cheat sheet
│   ├── 📁 api/                 # API documentation (planned)
│   ├── 📁 database/            # DB documentation (planned)
│   ├── 📁 deployment/          # Deployment guides (planned)
│   └── README.md               # Documentation index
│
├── 📁 config/                  # Project-wide configuration
├── 📁 scripts/                 # Automation scripts
│   ├── dev.sh                  # Development script (Unix/Linux/macOS)
│   └── dev.bat                 # Development script (Windows)
│
├── 📁 RefrenceMaterial/        # Design references and mockups
│   ├── 📁 Faculty_LoginPage/   # Login page designs
│   ├── 📁 Navbar & Footer/     # Navigation designs
│   └── 📁 Research/            # Research page mockups
│
├── package.json                # Workspace manager
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── .firebaserc                 # Firebase configuration
├── firebase.json               # Firebase hosting config
└── README.md                   # Main project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** or **yarn**
- **Git** for version control
- **MySQL** 8.0+ (for database features)

### 🗄️ **Database Setup (Optional)**

The project supports two database configurations:

**🚀 Quick Database Setup:**
```bash
# For enhanced database features
cd docs/database && cat setup-guide.md

# Quick commands:
mysql -u root -p -e "CREATE DATABASE updated_nitgoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd server && node switch-database.js updated && node test-db.js
```

**📚 Full Database Guide:** See [`docs/database/DATABASE-GUIDE.md`](./docs/database/DATABASE-GUIDE.md) for:
- Database switching between `nitgoa_db` and `updated_nitgoa`
- Schema details and API endpoints
- Troubleshooting and security features

> **💡 Note:** The frontend works without database setup. Database is needed for faculty management, authentication, and admin features.

### ⚡ **Instant Setup (3 Commands)**

```bash
# 1. Clone and navigate
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Switch to current development branch
git checkout backend-mysql-implementation

# 3. Install dependencies and start development
npm run install-all && npm run dev
```

**🎉 You're Ready!** Both servers will start automatically:
- **Frontend**: http://localhost:3000 (React.js UI)
- **Backend**: http://localhost:3001 (Express.js API)
- **Health Check**: http://localhost:3001/api/health

### 🔧 **Detailed Setup**

```bash
# 1. Clone repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Switch to development branch (current work)
git checkout backend-mysql-implementation

# 3. Install all dependencies (workspace + client + server)
npm run install-all

# 4. Setup environment variables (optional for basic development)
cp .env.example .env
# Edit .env with your Firebase credentials if needed

# 5. Start development servers with automatic port cleanup
npm run dev
```

### 🚨 **Port Conflicts?**

```bash
# Clean up any conflicting processes
npm run cleanup-ports

# Or manually check what's using the ports
lsof -ti:3000,3001 | xargs kill -9

# Then restart
npm run dev
```

### 🛠️ **Alternative Startup Methods**

```bash
# Using shell scripts (Unix/Linux/macOS)
./scripts/dev.sh              # Start both servers
./scripts/dev.sh client       # Frontend only
./scripts/dev.sh server       # Backend only

# Using Windows batch scripts
scripts\dev.bat               # Start both servers
scripts\dev.bat client        # Frontend only  
scripts\dev.bat server        # Backend only

# Individual NPM commands
npm run start-client          # Frontend only (with port cleanup)
npm run start-server          # Backend only (with port cleanup)
```

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
CREATE DATABASE updated_nitgoa;

# 5. Start development servers
npm run dev
```

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:3001

> **📖 Need detailed setup help?** See our [Complete Development Setup Guide](./docs/development/DEVELOPMENT_SETUP_GUIDE.md) for step-by-step instructions, troubleshooting, and team workflow.

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

> **💡 Want to understand our features in detail?** Explore our [Complete Documentation Hub](./docs/README.md) for technical deep-dives and implementation guides.

## 🛠️ Technology Stack

### 🎨 **Frontend** (client/)
- **React.js 19.1.0** - Latest React with concurrent features
- **React Router DOM 7.6.2** - Modern client-side routing
- **Context API** - Built-in state management (ThemeContext)
- **Axios 1.6.0** - HTTP client for API calls
- **CSS3 + Modern Features** - Backdrop filters, animations, responsive design
- **FontAwesome 6.7.2** - Icon library
- **Firebase 11.9.0** - Hosting and analytics

### 🔧 **Backend** (server/)
- **Node.js 16+** - JavaScript runtime environment
- **Express.js** - Minimal web framework
- **MySQL 8.0+** - Relational database (ready for implementation)
- **JWT** - JSON Web Tokens for authentication (planned)
- **Bcrypt** - Password hashing (planned)
- **Multer** - File upload handling (planned)
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Nodemailer 6.9.7** - Email service integration

### 🗄️ **Database** (Ready for Implementation)
- **MySQL 8.0+** - Primary database
- **Migrations** - Database version control (structure ready)
- **Seeds** - Initial data population (structure ready)
- **Schemas** - Database table definitions (structure ready)
- **Backups** - Automated backup system (structure ready)

### 🛠️ **Development Tools**
- **Concurrently** - Run multiple npm scripts simultaneously
- **Nodemon** - Auto-restart server on changes
- **ESLint** - Code quality and consistency
- **Testing Library** - React component testing
- **Jest** - JavaScript testing framework
- **React Scripts 5.0.1** - Build and development tools

### 🚀 **DevOps & Hosting**
- **Firebase Hosting** - Frontend deployment
- **Firebase Analytics** - User behavior tracking
- **Git** - Version control
- **GitHub** - Repository hosting and CI/CD
- **npm Workspaces** - Monorepo dependency management
- **Cross-platform Scripts** - Unix/Windows development scripts

### 📱 **Responsive & Modern Features**
- **Liquid Glass UI** - Apple-inspired design elements
- **Backdrop Filters** - Modern CSS effects
- **Responsive Design** - Mobile-first approach
- **Dark/Light Themes** - User preference support
- **Progressive Web App Ready** - PWA capabilities
- **SEO Optimized** - Search engine friendly structure

> **🔧 Dive deeper into our tech stack:**  
> • **Frontend details:** [Client Documentation](./client/README.md) - React setup, components, and architecture  
> • **Backend details:** [Server Documentation](./server/README.md) - API structure, database models, and middleware

## 📁 Available Scripts

> **⚡ Quick Start**: Use `npm run dev` to start both frontend and backend servers simultaneously

### 🚀 **Main Development Commands**

```bash
# 🚀 Start Everything (Recommended)
npm run dev              # Clean ports + start both servers
npm start               # Alias for npm run dev

# 🎯 Individual Services  
npm run dev-client      # Start only frontend (port 3000)
npm run dev-server      # Start only backend (port 3001)
npm run start-client    # Clean ports + start frontend only
npm run start-server    # Clean ports + start backend only
```

### 🔧 **Setup & Installation**

```bash
# 📦 Install Dependencies
npm run install-all     # Install root + client + server deps
npm run install-client  # Install only frontend dependencies  
npm run install-server  # Install only backend dependencies

# 🧹 Port Management
npm run cleanup-ports   # Clean up ports 3000 and 3001
npm run stop           # Stop all development servers
```

### 🏗️ **Build & Deploy**

```bash
# 🏗️ Production Build
npm run build          # Build frontend for production
npm run deploy         # Build + deploy to Firebase
npm run deploy:staging # Deploy to staging environment
npm run serve          # Serve built files locally

# 🔍 Testing & Quality
npm run test           # Run all tests
npm run test-client    # Frontend tests only
npm run test-server    # Backend tests only
npm run lint           # Run linting for both
npm run lint-client    # Frontend linting only
npm run lint-server    # Backend linting only
```

> **🚀 Production deployment help:** Check our [Deployment Guide](./docs/development/DEPLOYMENT_GUIDE.md) for Firebase setup, environment configuration, and CI/CD pipelines.

### 🛠️ **Cross-Platform Scripts**

```bash
# 🖥️ Unix/Linux/macOS
./scripts/dev.sh       # Full development script with port cleanup
./scripts/dev.sh client # Start only frontend
./scripts/dev.sh server # Start only backend

# 🪟 Windows
scripts\dev.bat        # Windows equivalent script
scripts\dev.bat client # Frontend only (Windows)
scripts\dev.bat server # Backend only (Windows)
```

### ⚙️ **Environment Setup**

```bash
# 1. Clone and navigate
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Switch to development branch
git checkout backend-mysql-implementation

# 3. Install all dependencies
npm run install-all

# 4. Setup environment variables (optional for frontend-only)
cp .env.example .env.local
# Edit .env.local with your Firebase credentials if needed

# 5. Start development servers
npm run dev
```

**🌐 Access URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **API Health Check**: http://localhost:3001/api/health

### 🚀 **Quick Development Workflow**

1. **🏗️ First Time Setup:**
   ```bash
   git clone <repository>
   cd nitgoa
   npm run install-all      # Install all dependencies
   ```

2. **📅 Daily Development:**
   ```bash
   npm run dev              # Start both servers
   # Frontend: http://localhost:3000
   # Backend API: http://localhost:3001
   # Health check: http://localhost:3001/api/health
   ```

3. **🛑 Stop Development:**
   ```bash
   # Press Ctrl+C in terminal, or run:
   npm run stop
   ```

4. **🏭 Production Build & Deploy:**
   ```bash
   npm run build            # Create production build
   npm run deploy           # Deploy to Firebase hosting
   ```

### 🎯 **Script Features**

#### **✨ Advanced Features of ./scripts/dev.sh:**
- **🎨 Colored Output** - Green for success, red for errors, blue for info
- **🔄 Port Conflict Resolution** - Automatically kills processes on ports 3000/3001
- **📦 Dependency Checking** - Auto-installs missing node_modules
- **⚡ Concurrent Execution** - Runs both servers simultaneously with proper naming
- **🛡️ Error Handling** - Graceful error messages and recovery options
- **📊 Status Updates** - Real-time feedback on operations

#### **🪟 Windows scripts\dev.bat Features:**
- **🔧 Port Cleanup** - Windows-compatible process termination
- **📦 Dependency Management** - Automatic installation checking  
- **🎯 Multiple Commands** - start, stop, clean, install, help options
- **🎨 Formatted Output** - Clear success/error messages
- **⚡ Concurrent Servers** - Both frontend and backend with proper colors

> **📜 Want to master all scripts?** Check our [Development Scripts Guide](./docs/development/DEVELOPMENT_SCRIPTS_GUIDE.md) for comprehensive script usage, troubleshooting, and advanced workflow tips.

## 🔌 API Endpoints

> **🔧 Status**: Route structure implemented, business logic in development

### 🔐 Authentication Routes (`/api/auth`)
```
POST /api/auth/login     - User login (JWT token) - ⏳ To be implemented  
POST /api/auth/logout    - User logout - ⏳ To be implemented
GET  /api/auth/me        - Current user info - ⏳ To be implemented
```

### 👨‍🏫 Faculty Management (`/api/faculty`)
```
GET  /api/faculty        - List all faculty members - ⏳ To be implemented
GET  /api/faculty/:id    - Get faculty details by ID - ⏳ To be implemented  
PUT  /api/faculty/:id    - Update own profile (faculty only) - ⏳ To be implemented
```

### 👑 Admin Operations (`/api/admin`)
```
GET  /api/admin/dashboard    - Admin dashboard data - ⏳ To be implemented
POST /api/admin/faculty      - Create new faculty account - ⏳ To be implemented
PUT  /api/admin/faculty/:id  - Update any faculty profile - ⏳ To be implemented
DELETE /api/admin/faculty/:id - Delete faculty account - ⏳ To be implemented
GET  /api/admin/users        - List all users - ⏳ To be implemented
```

### 📄 Content Management (`/api/content`) 
```
GET  /api/content/hero-images - Get hero carousel images - ⏳ To be implemented
POST /api/content/notices     - Add new announcements - ⏳ To be implemented
GET  /api/content/notices     - Get all announcements - ⏳ To be implemented
PUT  /api/content/notices/:id - Update announcement - ⏳ To be implemented
DELETE /api/content/notices/:id - Delete announcement - ⏳ To be implemented
```

### 📁 File Upload (`/api/upload`)
```
POST /api/upload/image       - Upload faculty images - ⏳ To be implemented
POST /api/upload/document    - Upload documents/PDFs - ⏳ To be implemented
DELETE /api/upload/:id       - Delete uploaded file - ⏳ To be implemented
```

### ✅ Health Check
```
GET  /api/health            - Server status check - ✅ Working
Response: {"status":"OK","message":"NIT Goa API is running"}
```

**🔒 Authentication Note**: All routes except `/api/health` will require JWT authentication when implemented.

> **📡 API Development Guide:** See our [Backend Documentation](./server/README.md) for detailed API implementation, middleware setup, and database integration examples.

## 📚 Documentation

- **[📖 Complete Documentation](./docs/README.md)** - Full documentation hub
- **[⚛️ Frontend Guide](./client/README.md)** - React.js setup & features
- **[🔧 Backend Guide](./server/README.md)** - Node.js API documentation
- **[🗄️ Database Guide](./docs/database/)** - Schema & migrations
- **[🚀 Deployment Guide](./docs/deployment/)** - Production setup

> **🎯 Looking for specific help?**  
> • **New to the project?** Start with our [Simple Team Guide](./docs/development/SIMPLE_TEAM_GUIDE.md)  
> • **Daily development?** Use the [Quick Reference](./docs/development/QUICK_REFERENCE.md)  
> • **Team workflow?** Check the [Team Reference Guide](./docs/development/TEAM_REFERENCE_GUIDE.md)

## 🎨 Current Features

### ✅ **Implemented Features**

#### **🏛️ Complete Website Pages** (35 Functional Routes)
✅ **🏠 Home Page** - Advanced carousel with 17 campus images, auto-rotation announcements with "Notice" badge styling  
✅ **📋 About** - Institute information with mission, vision, and history  
✅ **� GIAN** - Global Initiative of Academic Networks program  

**🎓 Academics Section (5 pages):**  
✅ **🏫 Departments** - Academic department information  
✅ **📜 Regulations** - Academic regulations and policies  
✅ **� Dissertation Formats** - Research dissertation guidelines  
✅ **📚 Syllabus** - Course syllabi and curricula  
✅ **📅 Academic Calendar** - Important dates and schedules  

**🎓 Admissions Section (6 pages):**  
✅ **� B.Tech JOSAA-CSAB** - Undergraduate admissions via JoSAA  
✅ **🌍 B.Tech DASA** - Direct Admission for NRI/foreign students  
✅ **🏢 B.Tech Facilities** - Campus facilities for B.Tech students  
✅ **� B.Tech Strengths** - Program highlights and advantages  
✅ **🎓 M.Tech** - Master's program admissions  
✅ **🔬 PhD** - Doctoral program information  

**👥 People Section (3 pages):**  
✅ **👨‍🏫 Faculty** - Comprehensive directory with 75+ faculty members across 7 departments (CSE, ECE, EEE, MCE, CVE, APS, HSS)  
✅ **👩‍💼 Administrative Staff** - Administrative personnel directory  
✅ **� Technical Staff** - Technical support staff listing  

**🔬 Research Section (2 pages):**  
✅ **📊 R&D Projects** - Research initiatives and ongoing projects  
✅ **🤝 MoU Details** - Memorandums of Understanding with institutions  

**🏛️ Administration Section (8 pages):**  
✅ **👑 Board of Governors** - Governing body information  
✅ **🎯 Director** - Director profile and message  
✅ **📋 Registrar** - Registrar office information  
✅ **�️ Senate** - Academic senate details  
✅ **🎓 Deans** - Dean profiles and responsibilities  
✅ **💼 Committees** - Various institutional committees  
✅ **💰 Finance Committee** - Financial oversight committee  
✅ **🏗️ Building Works Committee** - Infrastructure committee  

**📄 Additional Pages (7 pages):**  
✅ **� Heads of Departments** - HOD profiles with special highlighting  
✅ **📊 Annual Reports** - Institutional reports and statistics  
✅ **📞 Contact Us** - Complete contact information and location  
✅ **� RTI** - Right to Information portal  
✅ **🏆 NIRF** - National Institutional Ranking Framework  
✅ **� Tenders** - Procurement and bidding information  
✅ **🤝 Outreach Activities** - Community programs and partnerships  

#### **🎨 Advanced UI/UX Features** 
✅ **📢 Smart Announcement System** - Marquee-style announcements with 5-second auto-rotation, professional "Notice" badge styling, and clickable indicators  
✅ **🎛️ Enhanced Navigation** - React Router v7 with protected routes, optimized navbar with 60px margins, and improved responsive design  
✅ **🦶 Professional Footer** - Refactored with `footer-` prefixed CSS classes for better organization  
✅ **📱 Responsive Design** - Full mobile, tablet, and desktop compatibility across all 35 pages  

#### **👨‍🏫 Advanced Faculty Directory Features**
✅ **🌟 Liquid Glass Interface** - Apple-inspired translucent buttons with backdrop blur effects  
✅ **🔍 Department Filtering** - Interactive buttons with shimmer animations for 7 departments  
✅ **🎯 HOD Special Highlighting** - Horizontal card layouts for Heads of Department  
✅ **📊 Comprehensive Data** - 75+ faculty members with professional photography (200x200px)  
✅ **🔗 URL Parameter Support** - Direct department navigation via query parameters  
✅ **✨ Micro-Interactions** - Backdrop filters, cubic-bezier animations, and smooth transitions  

#### **� Hero Section Carousel**
✅ **🖼️ Image Gallery** - 17 campus images with auto-cycling slideshow  
✅ **🎮 Navigation Controls** - Left/right arrows and bottom indicators  
✅ **🎨 Professional Overlay** - Dark-to-light gradient for optimal text visibility  
✅ **⏱️ Auto-Timing** - 5-second image transitions with smooth animations  
✅ **📱 Full Responsiveness** - Optimized for all screen sizes  

#### **🏗️ Technical Implementation**
✅ **⚛️ React 19.1.0** - Latest React with React Router 7.6.2  
✅ **🎯 Modern Development** - React Hooks (useState, useEffect, useRef, useCallback, useMemo)  
✅ **📊 Dynamic Content** - Real-time statistics animation with counting effects  
✅ **🎨 Advanced CSS** - Custom animations, transitions, and responsive layouts  
✅ **🔄 State Management** - Context API for theme management  
✅ **📁 Organized Structure** - Clean component architecture with 35 routed pages  

#### **🛠️ Backend Infrastructure**
✅ **🚀 Express.js Server** - Complete backend setup with security middleware (helmet, CORS, rate limiting)  
✅ **📡 API Routes Structure** - Authentication, faculty, admin, content, and upload route handlers  
✅ **🔐 Security Features** - Rate limiting (100 requests/15min), CORS protection, body parsing limits (10MB)  
✅ **⚡ Development Setup** - Nodemon for auto-restart, environment-based CORS configuration  
✅ **📊 Health Monitoring** - API health endpoint at `/api/health`  

#### **📦 Project Architecture**
✅ **🏗️ Monorepo Structure** - Organized client/, server/, database/, shared/, docs/ directories  
✅ **🔧 NPM Workspaces** - Proper dependency management across frontend and backend  
✅ **📜 Cross-Platform Scripts** - Unix/Linux/macOS (dev.sh) and Windows (dev.bat) startup scripts  
✅ **⚙️ Development Automation** - Port cleanup, dependency checking, concurrent server startup  
✅ **📚 Comprehensive Documentation** - Setup guides, development scripts guide, team reference guide  

#### **� Deployment & Hosting**
✅ **🔥 Firebase Integration** - Complete Firebase hosting setup (project: nit-goa-28558, site: nit-goa-ac-in)  
✅ **📊 Analytics Ready** - Firebase Analytics configuration  
✅ **🚀 Production Build** - Optimized build pipeline with Firebase deployment  
✅ **🔄 Environment Configuration** - Environment variables setup with .env.example  

### 🔄 **In Development**
✅ **Backend API Foundation** - Express.js server with route structure (auth.js, faculty.js, admin.js, content.js, upload.js)  
🔄 **MySQL Database Integration** - Schema design and migrations setup in progress  
🔄 **JWT Authentication System** - Role-based login system for faculty and admin users  
🔄 **Admin Dashboard** - Faculty management interface with full CRUD operations  
🔄 **Faculty Profile Management** - Self-editing capabilities for faculty members  
🔄 **File Upload System** - Image and document handling with Cloudinary integration  
🔄 **Database Models** - User, Faculty, Content, and Admin models with relationships  

### 📋 **Development Status** (as of July 15, 2025)
- **✅ Phase 1 Complete** - Frontend development with 35 functional pages and advanced UI features
- **✅ Phase 2 Complete** - Project structure organization into monorepo with proper workspace management
- **✅ Phase 3 Complete** - Backend foundation with Express.js, security middleware, and route structure
- **✅ Phase 4 Complete** - Development automation with cross-platform scripts and port management
- **✅ Phase 5 Complete** - Firebase hosting setup and deployment pipeline
- **🔄 Phase 6 In Progress** - MySQL database schema, JWT authentication, and API implementation
- **📅 Phase 7 Planned** - Admin dashboard, faculty self-management, and real-time features

### 📋 **Next Implementation Priority**
1. **🗄️ Database Schema Creation** - MySQL tables for users, faculty, content, announcements
2. **🔐 Authentication Middleware** - JWT token validation and role-based access control
3. **� Admin Dashboard** - Faculty management, content editing, announcement system
4. **👤 Faculty Self-Service** - Profile editing, password management, document uploads
5. **📡 API Integration** - Connect frontend to backend with proper error handling

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

> **👥 New contributor?** Our [Team Reference Guide](./docs/development/TEAM_REFERENCE_GUIDE.md) covers Git workflow, code standards, and collaboration best practices.

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

## 👥 Team

**NIT Goa Development Team**
- **Lead Developer**: [Mrutyunjay Kumar Rao](https://github.com/mrutyunjaykumarrao)
- **Developer**: [Suyash Gaude](https://github.com/mrutyunjaykumarrao)
- **Developer**: [Jai Yadav](https://github.com/mrutyunjaykumarrao)
- **Developer**: [Vicky Prasad](https://github.com/mrutyunjaykumarrao)
- **Developer**: [Ankit Singh](https://github.com/mrutyunjaykumarrao)
- **Project**: Official NIT Goa Website
- **Branch**: `main`

## 🐛 Bug Reports & 💡 Feature Requests

- **Issues**: [GitHub Issues](https://github.com/mrutyunjaykumarrao/NIT-GOA/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mrutyunjaykumarrao/NIT-GOA/discussions)
- **Email**: mrutyunjaykumarrao22@gmail.com

## 📞 Support

For technical support or questions:
- 📧 **Email**: mrutyunjaykumarrao22@gmail.com
- 📱 **GitHub**: [Create an Issue](https://github.com/mrutyunjaykumarrao/NIT-GOA/issues)
- 📖 **Docs**: [Documentation Hub](./docs/README.md)

---

**🎓 Built with ❤️ for NIT Goa | 🚀 Empowering Education Through Technology**