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
// ======================
// NEW ORGANIZED API ROUTES
// ======================

// Authentication routes
app.use('/api/auth', require('./src/routes/auth'));

// Public display routes (for people section cards, visitor count, etc.)
app.use('/api/public', require('./src/routes/publicDisplay'));

// Faculty list routes (for faculty profile cards display)
app.use('/api/faculty-list', require('./src/routes/facultyList'));

// Faculty details routes (for complete faculty profile viewing)
app.use('/api/faculty-details', require('./src/routes/facultyDetailsAPI'));

// Faculty edit routes (authenticated - section-specific editing with preload)
app.use('/api/faculty-edit', require('./src/routes/facultyEdit'));

// Staff routes (technical and administrative staff)
app.use('/api/staff', require('./src/routes/staff'));

// Admin dashboard routes (analytics, user management, approvals, CRUD operations)
app.use('/api/admin', require('./src/routes/admin'));

// Analytics routes
app.use('/api/analytics', require('./src/routes/analytics'));

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




// Test the actual admin users query execution
app.get('/api/test-admin-query', async (req, res) => {
  try {
    const { executeQuery } = require('./src/config/database');
    const { pool } = require('./src/config/database');
    
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build WHERE clause and parameters for filtering
    let whereClause = '';
    const params = [];

    // Search filter - simplified for user_accounts only
    if (search && search.trim() !== '') {
      whereClause = ' WHERE (ua.username LIKE ? OR ua.email LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    // Status filter
    if (status && status !== 'all') {
      const statusCondition = whereClause ? ' AND ' : ' WHERE ';
      if (status === 'active') {
        whereClause += statusCondition + 'ua.is_active = 1 AND (ua.locked_until IS NULL OR ua.locked_until <= NOW())';
      } else if (status === 'inactive') {
        whereClause += statusCondition + 'ua.is_active = 0';
      } else if (status === 'locked') {
        whereClause += statusCondition + 'ua.locked_until > NOW()';
      }
    }

    // Construct final query and parameters
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    const finalParams = [...params, limitNum, offsetNum];
    
    const basicQuery = `
      SELECT 
        ua.user_id,
        ua.username,
        ua.email as user_email,
        ua.access_level,
        ua.is_active,
        ua.last_login,
        ua.failed_login_attempts,
        ua.locked_until,
        ua.created_at,
        CASE 
          WHEN ua.locked_until > NOW() THEN 'locked'
          WHEN ua.is_active = 0 THEN 'inactive'
          ELSE 'active'
        END as status
      FROM user_accounts ua
      ${whereClause}
      ORDER BY ua.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Try to execute the query
    const connection = await pool.getConnection();
    try {
      const [basicResults] = await connection.execute(basicQuery, finalParams);
      
      res.json({
        success: true,
        users: basicResults,
        count: basicResults.length,
        debug: {
          query: basicQuery,
          params: finalParams,
          placeholders: (basicQuery.match(/\?/g) || []).length,
          paramCount: finalParams.length
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage 
    });
  }
});

// Test user_accounts table directly
app.get('/api/test-users', async (req, res) => {
  try {
    const { executeQuery } = require('./src/config/database');
    // Test the basic count
    const result = await executeQuery('SELECT COUNT(*) as count FROM user_accounts');
    
    // Test parameterized query
    const paramResult = await executeQuery(`
      SELECT user_id, username FROM user_accounts LIMIT ?
    `, [2]);
    
    // Test the JOIN query that's failing in admin
    const joinResult = await executeQuery(`
      SELECT 
        ua.user_id,
        ua.username,
        ua.email as user_email,
        ua.access_level,
        ua.is_active,
        e.employee_id,
        e.full_name
      FROM user_accounts ua
      LEFT JOIN employees e ON ua.employee_code = e.employee_code
      LIMIT 1
    `);
    
    console.log('Basic count result:', result);
    console.log('JOIN result:', joinResult);
    
    res.json({ 
      status: 'success', 
      basicCount: result[0][0]?.count,
      paramResult: paramResult[0],
      joinResult: joinResult[0],
      message: 'All queries successful' 
    });
  } catch (error) {
    console.error('Test users error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      sqlMessage: error.sqlMessage,
      code: error.code
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
    version: '3.0.0',
    description: 'Organized API for College Profile Management System',
    lastUpdated: new Date().toISOString(),
    endpoints: {
      authentication: {
        'POST /api/auth/login': 'User login with JWT token generation',
        'POST /api/auth/change-password': 'Change user password (authenticated)',
        'GET /api/auth/validate': 'Validate JWT token',
        'POST /api/auth/logout': 'Logout user'
      },
      publicDisplay: {
        description: 'APIs for public-facing components (people section cards, visitor count)',
        'GET /api/public/people/faculty': 'Get all faculty for display cards',
        'GET /api/public/people/faculty/:departmentCode': 'Get faculty by department for cards',
        'GET /api/public/people/technical-staff': 'Get technical staff for display cards',
        'GET /api/public/people/administrative-staff': 'Get administrative staff for cards',
        'GET /api/public/departments': 'Get all active departments',
        'GET /api/public/courses': 'Get courses with optional filtering',
        'GET /api/public/research-areas': 'Get all research areas',
        'GET /api/public/visitor-count': 'Get total visitor count for footer'
      },
      facultyDetails: {
        description: 'APIs for faculty detail pages (viewing and editing)',
        'GET /api/faculty-details/:employeeCode': 'Get comprehensive faculty details for detail page'
      },
      adminDashboard: {
        description: 'APIs for admin dashboard functionality (requires authentication)',
        analytics: {
          'GET /api/admin/analytics/website': 'Get website analytics with optional period filter',
          'GET /api/admin/analytics/system': 'Get system analytics (users, employees, etc.)'
        },
        userManagement: {
          'GET /api/admin/users': 'Get all user accounts with pagination and filters',
          'POST /api/admin/users': 'Create new user account',
          'PUT /api/admin/users/:id': 'Update user account',
          'DELETE /api/admin/users/:id': 'Delete user account'
        },
        pendingApprovals: {
          'GET /api/admin/pending-approvals': 'Get all pending approval requests',
          'PUT /api/admin/pending-approvals/:id/approve': 'Approve a pending request',
          'PUT /api/admin/pending-approvals/:id/reject': 'Reject a pending request'
        },
        employeeManagement: {
          'GET /api/admin/employees': 'Get all employees for admin management',
          'GET /api/admin/faculty': 'Get all faculty for admin management',
          'GET /api/admin/staff': 'Get all staff for admin management'
        }
      },
      legacy: {
        description: 'Legacy endpoints (to be phased out)',
        'GET /api/public-legacy/*': 'Legacy public routes',
        'GET /api/faculty-profiles/*': 'Legacy faculty profile routes',
        'GET /api/faculty/core/*': 'Legacy modular faculty routes',
        'GET /api/admin-legacy/*': 'Legacy admin routes'
      }
    },
    usageGuidelines: {
      publicApis: 'No authentication required. Return only active/public data.',
      facultyDetails: 'Public viewing, authentication required for editing.',
      adminApis: 'Full authentication and admin role required.',
      responseFormat: 'All responses follow { success: boolean, data?: any, error?: string } format',
      errorHandling: 'HTTP status codes with descriptive error messages',
      rateLimit: 'Apply rate limiting for public endpoints'
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
