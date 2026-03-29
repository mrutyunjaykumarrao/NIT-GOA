const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration for Supabase
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Connection established event
pool.on('connect', (client) => {
  // Set timezone to UTC for every new connection
  client.query('SET timezone = "UTC"');
});

// Test database connection with enhanced error handling
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected successfully!');
    console.log('📊 Connected to Supabase PostgreSQL');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, 1 as test');
    console.log('🔍 Database query test:', result.rows[0].test === 1 ? 'PASSED' : 'FAILED');
    console.log('⏰ Database time:', result.rows[0].current_time);
    
    // Test if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Available tables:', tables);
    
    if (tables.length === 0) {
      console.warn('⚠️  No tables found. Database schema may need to be imported.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages based on error code
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Cannot connect to PostgreSQL server. Check your DATABASE_URL.');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('💡 Connection timeout. Check your network and database server.');
    } else if (error.code === '28P01') {
      console.log('💡 Authentication failed. Check your credentials in DATABASE_URL.');
    } else if (error.code === '3D000') {
      console.log('💡 The database does not exist.');
    } else {
      console.log('💡 Unexpected database error. Check your configuration.');
    }
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Enhanced query execution with error handling and logging
// Returns [rows, fields] to maintain compatibility with MySQL version
const executeQuery = async (query, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const startTime = Date.now();
    const result = await client.query(query, params);
    const executionTime = Date.now() - startTime;
    
    if (process.env.NODE_ENV === 'development' && executionTime > 1000) {
      console.warn(`⚠️  Slow query detected (${executionTime}ms):`, query.substring(0, 100) + '...');
    }
    
    // Return in MySQL-compatible format: [rows, fields]
    return [result.rows, result.fields];
  } catch (error) {
    console.error('❌ Query execution failed:', error.message);
    console.error('📝 Query:', query);
    console.error('🔍 Parameters:', params);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Transaction helper
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
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
      'user_accounts', 'departments', 'faculty_designations', 'courses', 'research_areas',
      'employees', 'staff_profiles', 'faculty_profiles', 'faculty_education',
      'faculty_publications', 'faculty_custom_sections',
      'faculty_custom_section_entries', 'faculty_courses_taught',
      'system_settings', 'audit_log', 'file_attachments'
    ];
    
    const [tables] = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const existingTables = tables.map(t => t.table_name);
    
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
