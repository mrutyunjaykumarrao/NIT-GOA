#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const { pool } = require(path.join(__dirname, '../server/src/config/database.js'));

async function fixAllSequences() {
  let connection;
  try {
    connection = await pool.connect();
    
    console.log('🔧 Fixing all database sequences...\n');
    
    const sequences = [
      { table: 'employees', id_column: 'employee_id', sequence: 'employees_employee_id_seq' },
      { table: 'pending_approvals', id_column: 'approval_id', sequence: 'pending_approvals_approval_id_seq' },
      { table: 'user_accounts', id_column: 'user_id', sequence: 'user_accounts_user_id_seq' }
    ];
    
    for (const seq of sequences) {
      try {
        const result = await connection.query(`
          SELECT setval('${seq.sequence}', COALESCE((SELECT MAX(${seq.id_column}) FROM ${seq.table}), 1))
        `);
        console.log(`✅ ${seq.table}: Sequence reset to ${result.rows[0].setval}`);
      } catch (error) {
        console.log(`⚠️  ${seq.table}: ${error.message}`);
      }
    }
    
    console.log('\n✅ All sequences fixed!\n');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

fixAllSequences();
