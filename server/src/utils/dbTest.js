const { pool } = require('../config/database');

// Test database connection and tables
const testDatabaseSetup = async () => {
  try {
    console.log('🔍 Testing database setup...');
    
    // Test connection
    const connection = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Check if required tables exist
    const result = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const tableNames = result.rows.map(t => t.table_name);
    
    console.log('📋 Available tables:', tableNames);
    
    const requiredTables = ['users', 'faculty_profiles'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables);
      console.log('💡 Please run the database schema setup script');
      return false;
    }
    
    // Test table structures
    for (const table of requiredTables) {
      const result = await connection.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
        [table]
      );
      console.log(`📊 Table '${table}' has ${result.rows.length} columns`);
    }
    
    // Check if admin user exists
    const adminResult = await connection.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );
    
    const adminCount = parseInt(adminResult.rows[0].count);
    if (adminCount === 0) {
      console.log('⚠️  No admin user found');
      console.log('💡 Consider creating an admin user');
    } else {
      console.log(`✅ Found ${adminCount} admin user(s)`);
    }
    
    connection.release();
    console.log('✅ Database setup test completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Database setup test failed:', error.message);
    return false;
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const bcrypt = require('bcrypt');
    
    const adminData = {
      username: 'admin',
      email: 'admin@nitgoa.ac.in',
      password: 'admin123', // Change this in production!
      role: 'admin'
    };
    
    // Check if admin already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [adminData.username, adminData.email]
    );
    
    if (existing.rows.length > 0) {
      console.log('ℹ️  Admin user already exists');
      return false;
    }
    
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [adminData.username, adminData.email, hashedPassword, adminData.role]
    );
    
    console.log('✅ Default admin user created successfully');
    console.log('📝 Login credentials:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('⚠️  Please change the default password after first login!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    return false;
  }
};

module.exports = {
  testDatabaseSetup,
  createDefaultAdmin
};
