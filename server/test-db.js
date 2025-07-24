#!/usr/bin/env node

// Database Test & Setup Script for NIT Goa Project
// Usage: npm run test:db
// This script tests database connectivity and schema without starting the full server

require('dotenv').config();
const { testConnection, pool } = require('./src/config/database');
const { testDatabaseSetup, createDefaultAdmin } = require('./src/utils/dbTest');

async function runTests() {
  console.log('🔧 NIT Goa Database Test & Setup');
  console.log('==================================\n');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('\n❌ Database connection failed. Please check your configuration.');
      console.log('💡 Verify your .env file has correct database credentials');
      process.exit(1);
    }
    
    console.log('\n2️⃣ Testing database schema...');
    const schemaValid = await testDatabaseSetup();
    
    if (!schemaValid) {
      console.log('\n⚠️  Database schema issues detected.');
      console.log('💡 Run: mysql -u root -p nitgoa_db < ../database/schemas/schema.sql');
      console.log('💡 Then: mysql -u root -p nitgoa_db < ../database/seeds/complete_faculty_data_migration.sql');
    }
    
    console.log('\n3️⃣ Checking admin user...');
    await createDefaultAdmin();
    
    console.log('\n✅ Database tests completed successfully!');
    console.log('\n🚀 Ready to start the server:');
    console.log('   • Full stack: ./scripts/dev.sh');
    console.log('   • Backend only: ./scripts/dev.sh server');
    console.log('   • Production: npm start');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('   • Check if MySQL is running: sudo service mysql status');
    console.log('   • Verify database exists: mysql -u root -p -e "SHOW DATABASES;"');
    console.log('   • Check .env configuration');
    process.exit(1);
  } finally {
    // Close database connections
    if (pool) {
      await pool.end();
    }
  }
}

// Run the tests
runTests();
