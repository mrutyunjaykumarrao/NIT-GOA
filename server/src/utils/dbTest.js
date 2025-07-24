const { pool } = require('../config/database');

// Test database connection and tables
const testDatabaseSetup = async () => {
  try {
    console.log('🔍 Testing database setup...');
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    
    // Check if required tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
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
      const [columns] = await connection.execute(`DESCRIBE ${table}`);
      console.log(`📊 Table '${table}' has ${columns.length} columns`);
    }
    
    // Check if admin user exists
    const [adminUsers] = await connection.execute(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );
    
    if (adminUsers[0].count === 0) {
      console.log('⚠️  No admin user found');
      console.log('💡 Consider creating an admin user');
    } else {
      console.log(`✅ Found ${adminUsers[0].count} admin user(s)`);
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
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [adminData.username, adminData.email]
    );
    
    if (existing.length > 0) {
      console.log('ℹ️  Admin user already exists');
      return false;
    }
    
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
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
