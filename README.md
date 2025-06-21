# NIT Goa Website - Official Institute Portal

[![Build Status](https://img.shields.io/badge/build-in%20development-yellow.svg)](https://github.com/mrutyunjaykumarrao/NIT-GOA)
[![Deployment](https://img.shields.io/badge/deployment-development-yellow.svg)](https://nit-goa-ac-in.web.app)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React%20Router-7.6.2-red.svg)](https://reactrouter.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Development-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **A modern website for the National Institute of Technology Goa - Currently under active development. Frontend needs completion (add/modify/remove pages), then backend development with MySQL database, user authentication system, and admin dashboard for content management.**

🌐 **Live Demo**: [https://nit-goa-ac-in.web.app](https://nit-goa-ac-in.web.app) *(Incomplete - Development Version)*  
📱 **Work in Progress** | ⚡ **Frontend Development Phase** | 🔄 **Major Development Required**

## ✨ Current Pages & Planned Features

### 🏛️ **Existing Pages** (18 - Need Review/Modification)
- **🏠 Home Page** - Hero carousel with 17 campus images, quick links, news updates, departments overview
- **📋 About** - Institute information, mission, vision, and history  
- **🎓 Admissions** - Programs, application process, important dates, fee structure
- **🔬 Research** - Research areas, facilities, statistics, collaborations, publications
- **🏫 Campus Life** - Facilities, activities, events, student services, hostel information
- **💼 Placement** - Statistics, recruiters, process, training programs, career services
- **👨‍🏫 Faculty** - Comprehensive faculty directory with liquid glass interface, department filtering, HOD highlights
- **📅 Academic Calendar** - Important dates, schedules, academic events
- **📞 Contact Us** - Complete contact information, location map, office details
- **🏢 Facilities** - Campus infrastructure, laboratories, library, sports facilities
- **🌐 GIAN** - Global Initiative of Academic Networks program details
- **🏆 NIRF** - National Institutional Ranking Framework information
- **🤝 Outreach Activities** - Community programs, social initiatives, partnerships
- **📜 RTI** - Right to Information portal and procedures
- **📋 Tenders** - Procurement information, bid announcements, vendor details

### 🧭 **Basic Navigation System** (Needs Enhancement)
- **React Router v7** - Basic routing implementation working
- **Catch-All Routing** - Automatic redirection to homepage for undefined routes
- **Basic Responsive Design** - Navigation working but needs improvement
- **Simple Navigation** - Basic menu structure implemented
- **404 Handling** - Graceful fallback to homepage for broken links
- **URL Access** - Direct page access via URL working

### 🎨 **Hero Section Features**
- **Image Carousel** - Auto-cycling slideshow of 17 NIT Goa campus images
- **Navigation Controls** - Left/right arrows and bottom indicators
- **Gradient Overlay** - Professional dark-to-light gradient for better text visibility
- **Responsive Design** - Optimized for all screen sizes (desktop to mobile)
- **Auto-timing** - Images change every 5 seconds with smooth transitions

### 👨‍🏫 **Faculty Page Features**
- **Comprehensive Faculty Directory** - 70+ faculty members across 7 departments (CSE, ECE, EEE, MCE, CVE, APS, HSS)
- **Liquid Glass Interface** - Apple-inspired translucent buttons with backdrop blur effects
- **Department Filtering** - Interactive buttons with shimmer animations and smooth transitions
- **HOD Highlighting** - Special horizontal card layouts for Heads of Department with enhanced styling
- **Smart Card Layouts** - Consistent dimensions with content overflow management and text truncation
- **Professional Photography** - Square faculty images (200x200px) with proper aspect ratios
- **URL Parameter Support** - Direct department navigation via query parameters
- **Advanced CSS Effects** - Backdrop filters, cubic-bezier animations, and micro-interactions

### 🎨 **Design & User Experience** (Basic Implementation)
- **Basic UI/UX** with functional design (needs enhancement)
- **Responsive design** working on most devices (needs optimization)
- **Loading performance** functional but needs optimization
- **Progressive Web App** basic setup (needs completion)
- **CSS Features** - Basic styling implemented (needs advanced features)
- **Accessibility** - Basic compliance (needs WCAG improvement)
- **Browser Compatibility** - Works on modern browsers (needs testing)

## 🚀 Project Status: **FRONTEND DEVELOPMENT PHASE** 🔄

### 🏗️ **Current Development Status**
- **✅ Initial Frontend**: Basic 18 pages implemented (needs enhancement)
- **✅ Basic Navigation**: Routing system and responsive design working
- **✅ Live Demo**: Development version at https://nit-goa-ac-in.web.app
- **🔄 Frontend Completion**: Major work needed - add/modify/remove pages
- **❌ Backend Development**: Not started - MySQL database integration planned
- **❌ Authentication System**: Not implemented - User login functionality planned
- **❌ Admin Dashboard**: Not developed - Content management system planned

### 🎯 **Development Roadmap**

#### **Phase 1: Frontend Completion** (Current Priority)
- **🔄 Page Review**: Analyze all 18 existing pages for relevance and accuracy
- **🔄 Page Addition**: Add new required pages for complete institute website
- **🔄 Page Modification**: Update and improve content on existing pages
- **🔄 Page Removal**: Remove unnecessary or redundant pages
- **🔄 Content Enhancement**: Complete all page content with accurate information
- **🔄 UI/UX Polish**: Refine design and user experience across all pages

#### **Phase 2: Backend Development** (After Frontend Complete)
- **📅 MySQL Database**: Design and implement complete database schema
- **📅 REST API Development**: Create comprehensive APIs for all data operations
- **📅 User Authentication**: Implement secure login/logout system
- **📅 Admin Dashboard**: Build content management interface for website updates
- **📅 Database Integration**: Connect frontend with backend services

#### **Phase 3: Full Integration** (Future)
- **📅 Security Implementation**: Comprehensive security measures
- **📅 Performance Optimization**: Backend and database optimization
- **📅 Testing & QA**: Complete testing across all features
- **📅 Production Deployment**: Final deployment with full functionality

## 📚 Documentation

### **🎯 For Team Members (Start Here!)**
- **[Quick Reference](QUICK_REFERENCE.md)** - ⭐ **Daily cheat sheet** - Bookmark this!
- **[Simple Team Guide](SIMPLE_TEAM_GUIDE.md)** - Basic workflow for beginners
- **[Development Setup Guide](DEVELOPMENT_SETUP_GUIDE.md)** - Complete environment setup
- **[Team Reference Guide](TEAM_REFERENCE_GUIDE.md)** - Comprehensive commands & troubleshooting

### **🚀 For Project Owner**
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - How to deploy the website manually

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ 
- **npm** or **yarn**
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# 4. Start development server
npm start
```

🌐 **Development server runs at**: `http://localhost:3000`

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## 🏗️ Tech Stack

### **Frontend** (Current)
- **React 19.1.0** - Latest React with concurrent features
- **React Router DOM 7.6.2** - Modern routing solution with React 19 compatibility
- **CSS3** - Custom responsive styling with advanced features
- **JavaScript ES6+** - Modern JavaScript features and React Hooks

### **Backend** (Planned)
- **MySQL Database** - Relational database for content management
- **Node.js/Express** - Backend API server (to be implemented)
- **JWT Authentication** - Secure user authentication system
- **Admin Dashboard** - Content management interface
- **REST APIs** - Backend services for data operations

### **Build & Development**
- **Create React App** - Zero-config build tool
- **Jest & React Testing Library** - Comprehensive testing
- **ESLint** - Code quality and consistency

### **Deployment**
- **Firebase Hosting** - Frontend hosting (development)
- **Environment Variables** - Secure configuration management
- **MySQL Hosting** - Database hosting (to be configured)

## 📂 Project Structure

```
nitgoa/
├── 📁 public/                    # Static assets and PWA files
│   ├── favicon.ico
│   ├── manifest.json            # PWA manifest
│   └── index.html
├── 📁 src/
│   ├── 📄 App.js                # Main app with basic routing (needs enhancement)
│   ├── 📄 index.js              # React DOM root
│   ├── 📁 Views/                # Basic page components (18 pages - need review)
│   │   ├── HomePage.js          # Landing page with hero carousel
│   │   ├── About.js             # Institute information (needs content review)
│   │   ├── Admissions.js        # Admission details (needs updates)
│   │   ├── Research.js          # Research initiatives (needs enhancement)
│   │   ├── Campus.js            # Campus life (needs content review)
│   │   ├── Faculty.js           # Faculty directory (needs data verification)
│   │   ├── Placement.js         # Placement information (needs updates)
│   │   ├── AcademicCalendar.js  # Academic calendar (needs current data)
│   │   ├── ContactUs.js         # Contact information (needs verification)
│   │   ├── Facilities.js        # Campus facilities (needs content review)
│   │   ├── GIAN.js              # GIAN program details (needs review)
│   │   ├── NIRF.js              # NIRF information (needs updates)
│   │   ├── OutreachActivities.js # Community programs (needs content)
│   │   ├── RTI.js               # RTI portal (needs implementation)
│   │   └── Tenders.js           # Procurement information (needs backend)
│   ├── 📁 components/           # Basic navigation components (need enhancement)
│   │   ├── MainNavigation/      # Basic navigation (needs improvement)
│   │   ├── Navbar/              # Header navigation (functional)
│   │   └── Footer/              # Footer component (basic implementation)
│   ├── 📁 assets/               # Images and media assets
│   │   └── images/              # Institute images and hero carousel
│   │       ├── Home/HeroImages/ # 17 campus carousel images
│   │       └── Faculty/         # Faculty photos (need verification)
│   └── 📁 utils/                # Utility functions and configurations
│       └── navigationConfig.js  # Centralized navigation management
├── 📁 build/                    # Production build (115.96 kB optimized)
├── 📚 Documentation/            # Essential project documentation
│   ├── README.md               # This file - project overview
│   ├── SIMPLE_TEAM_GUIDE.md    # Team collaboration guide for beginners
│   ├── DEVELOPMENT_SETUP_GUIDE.md # Development environment setup
│   └── DEPLOYMENT_GUIDE.md     # Manual deployment instructions
├── 🔧 firebase.json            # Firebase hosting configuration
└── 📦 package.json             # Dependencies and scripts
```

## 🎯 Current Progress & Development Status

### **Frontend Technical Metrics** (Basic Implementation)
- ✅ **Bundle Size**: 115.96 kB (gzipped, needs optimization)
- ✅ **Build Process**: React build working (~30 seconds)
- ✅ **Basic Loading**: Firebase hosting functional
- ✅ **Mobile Support**: Basic responsive design implemented
- ✅ **Cross-Browser**: Compatible with modern browsers
- 🔄 **SEO & Accessibility**: Needs improvement and optimization

### **Code Quality Status** (Work in Progress)
- ✅ **React Setup**: Basic React 19.1.0 and Router v7 working
- ✅ **Development Environment**: Local development functional
- ✅ **Git Repository**: Version control established
- 🔄 **Code Standards**: Needs consistent formatting and best practices
- 🔄 **Testing**: Limited test coverage, needs comprehensive testing
- 🔄 **Documentation**: Basic documentation, needs detailed guides

### **Feature Implementation Status** (Incomplete)
- 🔄 **18 Basic Pages**: Implemented but need review, modification, and enhancement
- ✅ **Basic Navigation**: Routing system working but needs improvement
- ✅ **Hero Carousel**: Working but may need content updates
- ✅ **Faculty Directory**: Basic implementation, needs data verification
- ❌ **Content Management**: No backend system yet
- ❌ **User Authentication**: Not implemented
- ❌ **Admin Dashboard**: Not developed
- ❌ **Database Integration**: MySQL backend not started

### **Recent Development Progress** (June 2025)
🔄 **CURRENT PHASE**: Frontend development requires completion before backend work
- 🔍 **Initial Assessment**: Basic 18 pages implemented but need major improvements
- 🔄 **Page Review Needed**: All pages require content verification and enhancement
- ✅ **Basic Deployment**: Development version available for testing
- 📝 **Team Collaboration**: Workflow established for 5-person development team
- 📦 **Repository Setup**: Git management and branch protection configured
- ⚠️ **Incomplete Status**: Significant frontend work needed before backend development
- 🚀 **Development Demo**: https://nit-goa-ac-in.web.app *(Work in Progress)*

## 🛠️ Development Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run test suite
npm run eject      # Eject from Create React App (⚠️ irreversible)
```

## 🚀 Deployment

### **Firebase Hosting** (Recommended)
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build and deploy
npm run build
firebase deploy
```

### **Other Hosting Options**
- **Netlify**: Drag and drop `build/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` package

📖 **Detailed deployment guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Test Status**: ✅ All tests passing (1/1)

## 🔒 Security

- ✅ **Environment Variables** - Sensitive data secured
- ✅ **Firebase Security Rules** - Access control implemented
- ✅ **HTTPS Enforced** - Secure data transmission
- ✅ **No Exposed Secrets** - Clean repository
- ✅ **Branch Protection** - Main branch protected with required reviews

## 🤝 Team Collaboration

### **Simple Workflow for Beginners**
```bash
# Team member workflow:
git checkout develop
git checkout -b yourname-feature
# Make changes
git add . && git commit -m "description"
git push origin yourname-feature
# Create PR to develop branch

# Project owner workflow:
# Review and merge PRs to develop
# When ready: merge develop to main
# Deploy manually: npm run build && firebase deploy
```

### **Branch Structure**
- **`main`** - Protected production branch (auto-deploys)
- **`develop`** - Team collaboration branch (requires PR)
- **`feature/*`** - Individual developer branches

**📖 Complete workflow guide**: [SIMPLE_TEAM_GUIDE.md](SIMPLE_TEAM_GUIDE.md)

### **🔄 Current Project Status**
- **🔄 Development Phase**: Frontend improvements and backend planning
- **✅ Team Collaboration**: Ready for 5-person development team
- **✅ Simple Workflow**: Beginner-friendly Git workflow established
- **✅ Documentation**: Simplified to essential guides only
- **🔄 Active Development**: Frontend completion and backend integration planned

## 🤝 Contributing

We welcome contributions from our team! Please follow the simple workflow:

1. **Clone** the repository and set up development environment
2. **Create** a feature branch from `develop` (`git checkout -b yourname-feature`)
3. **Make** your changes and test locally (`npm start`)
4. **Commit** your changes (`git commit -m 'describe what you did'`)
5. **Push** to your branch (`git push origin yourname-feature`)
6. **Create** a Pull Request to `develop` branch

### **Development Guidelines**
- Always work from the `develop` branch
- Test your changes locally before pushing
- Write clear commit messages
- Ask for help when stuck - better to ask than break something!

📖 **Complete guide**: [SIMPLE_TEAM_GUIDE.md](SIMPLE_TEAM_GUIDE.md)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🏛️ About NIT Goa

**National Institute of Technology Goa** is an Institute of National Importance established by an Act of Parliament. The institute is committed to excellence in technical education, research, and innovation.

### **Contact Information**
- 🌐 **Website**: [www.nitgoa.ac.in](https://www.nitgoa.ac.in)
- 📧 **Email**: director@nitgoa.ac.in
- 📞 **Phone**: +91-832-2404200
- 📍 **Address**: Farmagudi, Ponda, Goa 403401

## 🙏 Acknowledgments

- **NIT Goa Administration** for project support
- **React Community** for excellent documentation
- **Firebase Team** for hosting platform
- **Team Members** who contribute to the codebase

---

## 🎉 **PROJECT STATUS: FRONTEND DEVELOPMENT IN PROGRESS**

🔄 **Development Website**: https://nit-goa-ac-in.web.app  
✅ **Team Setup**: Ready for 5-person collaborative development  
✅ **Development Workflow**: Git workflow established for team collaboration  
🔄 **Major Work Required**: Frontend completion, then backend development  

**Current Priority**: Complete frontend (add/modify/remove pages), then start MySQL backend! 🚀 

### 🚀 **Development Status**
🔄 **The NIT Goa website is under active development - frontend needs completion before backend development with MySQL database, authentication, and admin dashboard!**

**🔗 Development Demo**: [https://nit-goa-ac-in.web.app](https://nit-goa-ac-in.web.app) *(Incomplete Version)*

### 📊 **Current Development Reality**
- **📱 18 Basic Pages**: Initial pages implemented, need review and enhancement
- **🔄 Frontend Work**: Major modifications needed - add/modify/remove pages
- **⚡ Development Setup**: Team collaboration environment ready
- **📦 35+ Git Commits**: Repository established with version control
- **👥 5-Person Team**: Ready for collaborative development workflow
- **❌ Backend Development**: MySQL database and authentication not started
- **❌ Admin Dashboard**: Content management system not developed
- **🔄 Incomplete Project**: Significant development work still required

**⚠️ This is a work-in-progress project requiring substantial development!**

*Built with ❤️ for NIT Goa by the development team*
