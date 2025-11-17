const jwt = require('jsonwebtoken');
const { pool } = require('../../config/database');

/**
 * SHARED MIDDLEWARE FOR FACULTY EDIT ENDPOINTS
 * Authentication, authorization, and common utilities
 */

// Helper function for database queries
async function executeQuery(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    connection.release();
  }
}

// Helper function for database transactions
async function withTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper function to format dates for MySQL (YYYY-MM-DD)
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// Helper function to format dates for output (YYYY-MM-DD)
const formatDateForOutput = (dateValue) => {
  if (!dateValue) return null;
  
  // If it's already a string in YYYY-MM-DD format, return as is
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // If it's an ISO string with time, extract just the date part
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }
  
  // Fallback: if it's a JavaScript Date object
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user can edit the faculty profile
const checkEditPermission = async (req, res, next) => {
  try {
    const { employeeCode } = req.params;
    const user = req.user;

    // Admin can edit any profile
    if (user.role === 'Admin') {
      return next();
    }

    // Faculty can only edit their own profile
    if (user.role === 'Faculty') {
      // Get user's employee code from database
      const userEmployeeCode = await executeQuery(
        'SELECT employee_code FROM employees WHERE user_id = ?',
        [user.userId]
      );

      if (userEmployeeCode.length === 0) {
        return res.status(403).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      if (userEmployeeCode[0].employee_code !== employeeCode) {
        return res.status(403).json({ 
          success: false,
          error: 'You can only edit your own profile' 
        });
      }

      return next();
    }

    // Unknown role
    return res.status(403).json({ 
      success: false,
      error: 'Insufficient permissions' 
    });
  } catch (error) {
    console.error('Permission check error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error during permission check' 
    });
  }
};

// Validation helper functions
const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (phone && !phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    throw new Error('Invalid phone number format');
  }
};

const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  if (year && (year < 1900 || year > currentYear + 10)) {
    throw new Error('Invalid year');
  }
};

const validateURL = (url, fieldName = 'URL') => {
  if (!url) return;
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid ${fieldName} format`);
  }
};

// Response formatting helpers
const formatSuccessResponse = (data, message = null) => {
  const response = { success: true };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  return response;
};

const formatErrorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    error: error.message || error,
    statusCode
  };
};

module.exports = {
  executeQuery,
  withTransaction,
  formatDateForMySQL,
  formatDateForOutput,
  authenticateToken,
  checkEditPermission,
  validateRequired,
  validateEmail,
  validatePhone,
  validateYear,
  validateURL,
  formatSuccessResponse,
  formatErrorResponse
};
