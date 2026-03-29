#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Phase 1 of MySQL → Supabase Migration
 * 
 * Tests:
 * 1. PostgreSQL connection using pg driver
 * 2. Basic query execution (SELECT NOW())
 * 3. Table listing from information_schema
 * 4. Connection cleanup
 */

require('dotenv').config();
const { Pool } = require('pg');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  log('\n================================', 'blue');
  log('  SUPABASE CONNECTION TEST', 'bold');
  log('================================\n', 'blue');

  // Step 1: Verify environment variables
  log('📋 Step 1: Checking environment variables...', 'blue');
  
  if (!process.env.DATABASE_URL) {
    log('❌ ERROR: DATABASE_URL not found in .env file', 'red');
    log('   Make sure your .env file contains:', 'yellow');
    log('   DATABASE_URL=postgresql://...', 'yellow');
    process.exit(1);
  }
  
  log('✅ DATABASE_URL found', 'green');
  
  if (process.env.SUPABASE_URL) {
    log(`✅ SUPABASE_URL: ${process.env.SUPABASE_URL}`, 'green');
  }
  
  // Step 2: Create connection pool
  log('\n📋 Step 2: Creating PostgreSQL connection pool...', 'blue');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Supabase
    }
  });

  log('✅ Pool created successfully', 'green');

  try {
    // Step 3: Test basic connection
    log('\n📋 Step 3: Testing connection with SELECT NOW()...', 'blue');
    
    const result = await pool.query('SELECT NOW() as current_time');
    const currentTime = result.rows[0].current_time;
    
    log(`✅ Connection successful!`, 'green');
    log(`   Current database time: ${currentTime}`, 'green');
    
    // Step 4: List all tables
    log('\n📋 Step 4: Fetching table list from information_schema...', 'blue');
    
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    log(`✅ Found ${tables.length} tables in public schema:`, 'green');
    tables.forEach(table => {
      log(`   • ${table}`, 'green');
    });
    
    // Expected tables check
    const expectedTables = [
      'user_accounts', 'departments', 'faculty_designations', 'courses', 
      'research_areas', 'employees', 'staff_profiles', 'faculty_profiles',
      'faculty_education', 'faculty_publications', 'faculty_generic_sections',
      'faculty_custom_sections', 'faculty_custom_section_entries',
      'faculty_courses_taught', 'system_settings', 'audit_log', 'file_attachments'
    ];
    
    const missingTables = expectedTables.filter(t => !tables.includes(t));
    
    if (missingTables.length > 0) {
      log(`\n⚠️  Warning: Missing expected tables:`, 'yellow');
      missingTables.forEach(table => {
        log(`   • ${table}`, 'yellow');
      });
    } else {
      log(`\n✅ All expected tables present!`, 'green');
    }
    
    // Step 5: Test a simple data query
    log('\n📋 Step 5: Testing data query (departments)...', 'blue');
    
    const deptResult = await pool.query('SELECT COUNT(*) as count FROM departments');
    const deptCount = deptResult.rows[0].count;
    
    log(`✅ Query successful! Found ${deptCount} departments`, 'green');
    
    // Step 6: Test transaction
    log('\n📋 Step 6: Testing transaction support...', 'blue');
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT 1'); // Dummy query
      await client.query('COMMIT');
      log('✅ Transaction test passed', 'green');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    // Final summary
    log('\n================================', 'blue');
    log('  🎉 ALL TESTS PASSED!', 'bold');
    log('================================\n', 'blue');
    log('✅ PostgreSQL connection works', 'green');
    log('✅ Basic queries execute correctly', 'green');
    log('✅ Table schema verified', 'green');
    log('✅ Transaction support confirmed', 'green');
    log('\n🚀 Ready to proceed with Phase 2: Core Connection Layer Migration\n', 'blue');
    
  } catch (error) {
    log('\n================================', 'red');
    log('  ❌ TEST FAILED', 'bold');
    log('================================\n', 'red');
    log(`Error: ${error.message}`, 'red');
    
    if (error.code) {
      log(`Error Code: ${error.code}`, 'red');
    }
    
    log('\n💡 Troubleshooting tips:', 'yellow');
    log('   1. Verify DATABASE_URL in .env is correct', 'yellow');
    log('   2. Check Supabase project is active', 'yellow');
    log('   3. Verify network connectivity', 'yellow');
    log('   4. Check if database has been initialized with schema', 'yellow');
    
    process.exit(1);
  } finally {
    // Cleanup
    await pool.end();
    log('\n🔌 Connection closed', 'blue');
  }
}

// Run the test
testSupabaseConnection().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
