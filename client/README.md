# NIT Goa Website - Frontend Client

This is the React.js frontend application for the NIT Goa official website.

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm start
```
The app will run on http://localhost:3000

### Build for Production
```bash
npm run build
```

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
- `REACT_APP_API_URL` - Backend API URL
- Firebase configuration variables

## Project Structure
```
src/
├── components/     # Reusable components
├── Views/         # Page components  
├── contexts/      # React contexts
├── services/      # API services
├── utils/         # Utility functions
└── assets/        # Images, styles
```

## Features
- Responsive design
- Theme switching
- Role-based authentication
- Admin dashboard
- Faculty profile management
