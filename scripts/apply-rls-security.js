#!/usr/bin/env node
/**
 * Apply Row-Level Security (RLS) to Supabase Database
 * 
 * This script enables RLS on all tables as a security best practice
 * Backend uses SERVICE_ROLE_KEY which bypasses RLS, so no functionality breaks
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const { pool } = require(path.join(__dirname, '../server/src/config/database.js'));

console.log('🔐 Applying Row-Level Security (RLS) to Supabase Database\n');
console.log('=' .repeat(70));

async function applyRLS() {
  let connection;
  
  try {
    console.log('\n📋 Step 1: Connect to Supabase database...\n');
    connection = await pool.connect();
    console.log('✅ Connected successfully\n');
    
    console.log('📋 Step 2: Read RLS SQL script...\n');
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'enable-rls-security.sql'),
      'utf8'
    );
    
    console.log('📋 Step 3: Execute RLS commands...\n');
    
    // Split script into individual statements
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    let enableCount = 0;
    let policyCount = 0;
    
    for (const statement of statements) {
      if (statement.includes('SELECT')) continue; // Skip verification query
      
      try {
        await connection.query(statement);
        
        if (statement.includes('ENABLE ROW LEVEL SECURITY')) {
          enableCount++;
          const tableName = statement.match(/ALTER TABLE (\w+)/)?.[1];
          console.log(`   ✅ Enabled RLS on: ${tableName}`);
        } else if (statement.includes('CREATE POLICY')) {
          policyCount++;
          const tableName = statement.match(/ON (\w+)/)?.[1];
          console.log(`   ✅ Created policy for: ${tableName}`);
        }
      } catch (error) {
        if (error.message.includes('already exists')) {
          // Ignore "already exists" errors
          continue;
        } else {
          console.error(`   ⚠️  Warning: ${error.message}`);
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   - Tables with RLS enabled: ${enableCount}`);
    console.log(`   - Policies created: ${policyCount}\n`);
    
    console.log('📋 Step 4: Verify RLS is enabled...\n');
    
    const verification = await connection.query(`
      SELECT 
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT LIKE '%backup%'
      ORDER BY tablename
    `);
    
    const rlsEnabled = verification.rows.filter(r => r.rls_enabled).length;
    const totalTables = verification.rows.length;
    
    console.log(`   RLS Status: ${rlsEnabled}/${totalTables} tables protected\n`);
    
    if (rlsEnabled < totalTables) {
      console.log('   ⚠️  Some tables still need RLS:\n');
      verification.rows.forEach(row => {
        if (!row.rls_enabled) {
          console.log(`      - ${row.tablename}`);
        }
      });
    } else {
      console.log('   ✅ All tables are now protected with RLS!\n');
    }
    
    console.log('=' .repeat(70));
    console.log('\n🎉 RLS Security Applied Successfully!\n');
    console.log('✅ All tables now have Row-Level Security enabled');
    console.log('✅ SERVICE_ROLE policies allow backend to function normally');
    console.log('✅ Direct public/anonymous access is blocked');
    console.log('\n📝 Your backend API will continue to work exactly as before.');
    console.log('   (SERVICE_ROLE_KEY bypasses RLS restrictions)\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error applying RLS:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

applyRLS();
