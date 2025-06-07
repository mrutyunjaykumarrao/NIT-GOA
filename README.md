# NIT Goa Website Redesign

## Project Overview
A modern, responsive redesign of the NIT Goa website built with React and MySQL, featuring custom components and an elegant faculty profile system.

## Tech Stack
- **Frontend:** React.js (custom components)
- **Backend:** Node.js with Express
- **Database:** MySQL
- **Build Tools:** npm/Yarn

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-org/nit-goa-redesign.git
cd nit-goa-redesign
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
- Copy `.env.example` to `.env`
- Configure database credentials:
    ```
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASS=your_password
    DB_NAME=nitgoa_db
    ```

### 4. Database setup
```bash
mysql -u root -p < schema.sql
```

## Development

### Start the application
```bash
# Frontend development server
npm run dev

# Backend server
npm run server
```

### Database migrations
```bash
npm run migrate
```

## Project Structure
```
nit-goa-redesign/
├── public/
│   └── assets/           # Images, icons, static files
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── styles/          # CSS modules and global styles
│   ├── utils/           # Utility functions and API clients
│   └── hooks/           # Custom React hooks
├── server/
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   └── middleware/      # Express middleware
├── schema.sql           # Database schema
├── .env.example         # Environment template
└── package.json
```

## Features

### Faculty Profile System
- **Card Layout:** Responsive grid with hover effects
- **Profile Data:** Name, designation, department, photo, contact info
- **Interactive Elements:** Modal view, contact forms, research interests

### Key Components
- Navigation header with responsive menu
- Hero section with dynamic content
- News and announcements carousel
- Department showcase
- Contact and location maps

## API Endpoints
```
GET    /api/faculty           # Fetch all faculty
GET    /api/faculty/:id       # Fetch specific faculty
POST   /api/contact          # Submit contact form
GET    /api/news             # Fetch news articles
```

## Contributing

1. Fork the repository
2. Create a feature branch
     ```bash
     git checkout -b feature/amazing-feature
     ```
3. Commit your changes
     ```bash
     git commit -m "Add amazing feature"
     ```
4. Push to the branch
     ```bash
     git push origin feature/amazing-feature
     ```
5. Open a Pull Request

## Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support and queries, contact the development team at dev@nitgoa.ac.in
