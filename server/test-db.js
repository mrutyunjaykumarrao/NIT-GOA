#!/usr/bin/env node

// Test Database Connection Script for NIT Goa Project
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
      process.exit(1);
    }
    
    console.log('\n2️⃣ Testing database schema...');
    const schemaValid = await testDatabaseSetup();
    
    if (!schemaValid) {
      console.log('\n⚠️  Database schema issues detected.');
      console.log('💡 Please run the schema setup script from database/schemas/schema.sql');
    }
    
    console.log('\n3️⃣ Checking admin user...');
    await createDefaultAdmin();
    
    console.log('\n✅ Database tests completed!');
    console.log('\n🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
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
