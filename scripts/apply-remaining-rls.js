#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const { pool } = require(path.join(__dirname, '../server/src/config/database.js'));

async function applyRemainingRLS() {
  let connection;
  try {
    connection = await pool.connect();
    
    const tables = ['user_accounts', 'faculty_profiles', 'staff_profiles', 'pending_approvals', 'courses'];
    
    console.log('�� Enabling RLS on remaining tables...\n');
    
    for (const table of tables) {
      try {
        await connection.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
        console.log(`✅ Enabled RLS on: ${table}`);
      } catch (error) {
        if (error.message.includes('already enabled')) {
          console.log(`✅ RLS already enabled on: ${table}`);
        } else {
          console.error(`❌ Error on ${table}: ${error.message}`);
        }
      }
    }
    
    console.log('\n📋 Verifying all tables...\n');
    
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
    
    console.log(`✅ RLS Status: ${rlsEnabled}/${totalTables} tables protected\n`);
    
    if (rlsEnabled === totalTables) {
      console.log('🎉 SUCCESS! All tables now have RLS enabled!\n');
    } else {
      console.log('⚠️  Tables without RLS:\n');
      verification.rows.forEach(row => {
        if (!row.rls_enabled) {
          console.log(`   - ${row.tablename}`);
        }
      });
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (connection) connection.release();
    process.exit(1);
  }
}

applyRemainingRLS();
