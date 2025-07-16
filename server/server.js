const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import database configuration and utilities
const { testConnection } = require('./src/config/database');
const { testDatabaseSetup, createDefaultAdmin } = require('./src/utils/dbTest');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nitgoa-website.web.app', 'https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/faculty', require('./src/routes/faculty'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/content', require('./src/routes/content'));
app.use('/api/upload', require('./src/routes/upload'));

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ status: 'success', message: 'Database connection successful' });
    } else {
      res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NIT Goa API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize database and start server
const initializeApp = async () => {
  console.log('🚀 Starting NIT Goa Server...');
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }
  
  // Test database setup
  const dbSetupValid = await testDatabaseSetup();
  if (!dbSetupValid) {
    console.warn('⚠️  Database setup issues detected');
  }
  
  // Create default admin if none exists
  await createDefaultAdmin();
  
  const PORT = process.env.PORT || 3001;
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 NIT Goa Server running on http://localhost:${PORT}`);
    console.log(`📖 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database Test: http://localhost:${PORT}/api/test-db`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Process terminated');
    });
  });
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start the application
initializeApp().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
