const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import updated database configuration and utilities
const { testConnection, validateSchema, initializeDatabase } = require('./src/config/database');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nitgoa-website.web.app', 'https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting with different limits for different routes
const createRateLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
app.use('/api/', createRateLimiter(
  (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  process.env.RATE_LIMIT_MAX || 100, // 100 requests per window
  'Too many requests from this IP, please try again later.'
));

// Stricter rate limiting for auth endpoints (very lenient for testing progressive lockout)
app.use('/api/auth/', createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10000, // 10000 login attempts per window (very generous for testing)
  'Too many authentication attempts, please try again later.'
));

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_FILE_SIZE || '10mb' 
}));

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from client's public directory (for images)
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API Routes - New organized structure
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/public', require('./src/routes/publicRoutes'));
app.use('/api/faculty-profiles', require('./src/routes/facultyProfiles'));
app.use('/api/faculty-details', require('./src/routes/facultyDetails'));
app.use('/api/faculty-edit', require('./src/routes/facultyEdit'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/analytics', require('./src/routes/analytics'));

// Currently used routes
app.use('/api/staff', require('./src/routes/staff'));

// Temporary backward compatibility - will redirect to new endpoints
app.use('/api/faculty', (req, res) => {
  if (req.path.includes('/details')) {
    return res.redirect(`/api/faculty-details${req.path}`);
  } else {
    return res.redirect(`/api/faculty-profiles${req.path}`);
  }
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      const schemaValid = await validateSchema();
      res.json({ 
        status: 'success', 
        message: 'Database connection successful',
        schema_valid: schemaValid
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Enhanced health check
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    const { SystemSetting } = require('./src/models/index');
    const systemSettingModel = new SystemSetting();
    const maintenanceMode = await systemSettingModel.getByKey('maintenance_mode');
    
    const healthStatus = {
      status: 'OK',
      message: 'NIT Goa API is running',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      database: dbConnected ? 'connected' : 'disconnected',
      maintenance_mode: maintenanceMode ? maintenanceMode.setting_value : false,
      environment: process.env.NODE_ENV || 'development'
    };

    // If maintenance mode is enabled, return 503
    if (maintenanceMode && maintenanceMode.setting_value === true) {
      return res.status(503).json({
        ...healthStatus,
        status: 'MAINTENANCE',
        message: 'System is under maintenance'
      });
    }

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  const apiDocs = {
    title: 'NIT Goa API Documentation',
    version: '2.0.0',
    description: 'Enhanced API for College Profile Management System',
    endpoints: {
      authentication: {
        'POST /api/auth/login': 'User login with JWT token generation',
        'POST /api/auth/change-password': 'Change user password (authenticated)',
        'GET /api/auth/validate': 'Validate JWT token',
        'POST /api/auth/logout': 'Logout user'
      },
      public: {
        'GET /api/public/employees': 'Get all employees (public data)',
        'GET /api/public/employees/:id': 'Get employee profile by ID',
        'GET /api/public/departments': 'Get all departments',
        'GET /api/public/research-areas': 'Get research areas (hierarchical)',
        'GET /api/public/settings': 'Get public system settings',
        'GET /api/public/search': 'Search employees',
        'GET /api/public/stats': 'Get system statistics'
      },
      faculty: {
        'GET /api/faculty/my-profile': 'Get faculty own profile',
        'PUT /api/faculty/my-profile': 'Update faculty profile',
        'GET /api/faculty/my-profile/education': 'Get faculty education records',
        'POST /api/faculty/my-profile/education': 'Add education record',
        'PUT /api/faculty/my-profile/education/:id': 'Update education record',
        'DELETE /api/faculty/my-profile/education/:id': 'Delete education record',
        'GET /api/faculty/my-profile/publications': 'Get faculty publications',
        'POST /api/faculty/my-profile/publications': 'Add publication',
        'PUT /api/faculty/my-profile/publications/:id': 'Update publication',
        'DELETE /api/faculty/my-profile/publications/:id': 'Delete publication'
      },
      system: {
        'GET /api/health': 'System health check',
        'GET /api/test-db': 'Database connection test',
        'GET /api/docs': 'API documentation'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT token in Authorization header for protected routes'
    }
  };

  res.json(apiDocs);
});

// Initialize database and start server
const initializeApp = async () => {
  console.log('🚀 Starting NIT Goa Server (Updated Version 2.0)...');
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }
  
  // Validate database schema
  try {
    const schemaValid = await validateSchema();
    if (!schemaValid) {
      console.warn('⚠️  Database schema validation failed. Some features may not work correctly.');
    }
  } catch (error) {
    console.warn('⚠️  Schema validation error:', error.message);
  }
  
  // Initialize database with default data
  try {
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.warn('⚠️  Database initialization had issues');
    }
  } catch (error) {
    console.warn('⚠️  Database initialization error:', error.message);
  }
  
  const PORT = process.env.PORT || 3001;
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 NIT Goa Server running on http://localhost:${PORT}`);
    console.log(`📖 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database Test: http://localhost:${PORT}/api/test-db`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database: ${process.env.DB_NAME || 'updated_nitgoa'}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    console.log('✅ Server initialization completed successfully!');
  });
  
  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };
  
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.stack);
  
  // Log error to audit table if database is available
  try {
    const { executeQuery } = require('./src/config/database');
    executeQuery(`
      INSERT INTO audit_log (table_name, record_id, action, new_values, ip_address, user_agent)
      VALUES ('system_errors', 0, 'ERROR', ?, ?, ?)
    `, [
      JSON.stringify({ error: err.message, stack: err.stack }), 
      req.ip, 
      req.get('User-Agent')
    ]).catch(dbErr => {
      console.error('Failed to log error to database:', dbErr.message);
    });
  } catch (dbError) {
    // Database not available, continue without logging
  }
  
  res.status(err.status || 500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    suggestion: 'Check /api/docs for available endpoints'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
initializeApp().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
