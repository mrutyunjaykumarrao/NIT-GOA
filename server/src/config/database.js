const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'updated_nitgoa',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  charset: 'utf8mb4', // Support for emojis and special characters
  timezone: '+00:00' // Use UTC
};

// Create connection pool with enhanced configuration
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 20, // Increased for better performance
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Ensure UTC timezone for all connections
  timezone: '+00:00',
  // Handle JSON columns properly
  typeCast: function (field, next) {
    if (field.type === 'JSON') {
      return JSON.parse(field.string());
    }
    return next();
  }
});

// Set timezone to UTC for every connection
pool.on('connection', function (connection) {
  connection.query('SET time_zone = "+00:00"');
  console.log('Connection timezone set to UTC');
});

// Test database connection with enhanced error handling
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`📊 Connected to database: ${dbConfig.database}`);
    
    // Test if database connection works
    // Skip database existence check for now - the connection config should handle this
    
    // Test if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));
    
    if (tables.length === 0) {
      console.warn('⚠️  No tables found. Database schema may need to be imported.');
    }
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('🔍 Database query test:', rows[0].test === 1 ? 'PASSED' : 'FAILED');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    switch (error.code) {
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('💡 Check your username and password in the .env file');
        break;
      case 'ER_BAD_DB_ERROR':
        console.log('💡 The database does not exist. Please create it first.');
        break;
      case 'ECONNREFUSED':
        console.log('💡 Cannot connect to MySQL server. Make sure it is running.');
        break;
      case 'ETIMEDOUT':
        console.log('💡 Connection timeout. Check your network and database server.');
        break;
      default:
        console.log('💡 Unexpected database error. Check your configuration.');
    }
    return false;
  }
};

// Enhanced query execution with error handling and logging
const executeQuery = async (query, params = []) => {
  const connection = await pool.getConnection();
  try {
    const startTime = Date.now();
    const [rows, fields] = await connection.execute(query, params);
    const executionTime = Date.now() - startTime;
    
    if (process.env.NODE_ENV === 'development' && executionTime > 1000) {
      console.warn(`⚠️  Slow query detected (${executionTime}ms):`, query.substring(0, 100) + '...');
    }
    
    return [rows, fields];
  } catch (error) {
    console.error('❌ Query execution failed:', error.message);
    console.error('📝 Query:', query);
    console.error('🔍 Parameters:', params);
    throw error;
  } finally {
    connection.release();
  }
};

// Transaction helper
const withTransaction = async (callback) => {
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
};

// Helper function to handle JSON fields
const prepareJsonFields = (data, jsonFields = []) => {
  const prepared = { ...data };
  jsonFields.forEach(field => {
    if (prepared[field] && typeof prepared[field] === 'object') {
      prepared[field] = JSON.stringify(prepared[field]);
    }
  });
  return prepared;
};

// Helper function to parse JSON fields
const parseJsonFields = (data, jsonFields = []) => {
  if (!data) return data;
  
  const parsed = Array.isArray(data) ? [...data] : { ...data };
  
  if (Array.isArray(parsed)) {
    return parsed.map(item => parseJsonFields(item, jsonFields));
  }
  
  jsonFields.forEach(field => {
    if (parsed[field] && typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (error) {
        console.warn(`⚠️  Failed to parse JSON field '${field}':`, error.message);
      }
    }
  });
  
  return parsed;
};

// Database schema validation
const validateSchema = async () => {
  try {
    const requiredTables = [
      'user_accounts', 'departments', 'designations', 'courses', 'research_areas',
      'employees', 'staff_profiles', 'faculty_profiles', 'faculty_education',
      'faculty_publications', 'faculty_generic_sections', 'faculty_custom_sections',
      'faculty_custom_section_entries', 'faculty_courses_taught', 'faculty_research_areas',
      'system_settings', 'audit_log', 'file_attachments'
    ];
    
    const [tables] = await executeQuery('SHOW TABLES');
    const existingTables = tables.map(t => Object.values(t)[0]);
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.warn('⚠️  Missing required tables:', missingTables);
      return false;
    }
    
    console.log('✅ Database schema validation passed');
    return true;
  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    return false;
  }
};

// Initialize database with default data
const initializeDatabase = async () => {
  try {
    // Check if system_settings table has data
    const [settings] = await executeQuery('SELECT COUNT(*) as count FROM system_settings');
    
    if (settings[0].count === 0) {
      console.log('📝 Initializing default system settings...');
      await executeQuery(`
        INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
        ('site_name', 'NIT Goa', 'string', 'Name of the institution', true),
        ('site_description', 'National Institute of Technology Goa', 'string', 'Institution description', true),
        ('maintenance_mode', 'false', 'boolean', 'Whether the site is in maintenance mode', false),
        ('max_file_upload_size', '5242880', 'number', 'Maximum file upload size in bytes', false),
        ('default_pagination_limit', '20', 'number', 'Default number of records per page', false)
      `);
    }
    
    console.log('✅ Database initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  withTransaction,
  prepareJsonFields,
  parseJsonFields,
  validateSchema,
  initializeDatabase,
  dbConfig
};
