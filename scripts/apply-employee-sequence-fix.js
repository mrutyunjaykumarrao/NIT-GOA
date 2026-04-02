#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
const { pool } = require(path.join(__dirname, '../server/src/config/database.js'));

async function fixSequence() {
  let connection;
  try {
    connection = await pool.connect();
    
    console.log('🔧 Fixing employee_id sequence...\n');
    
    const result = await connection.query(`
      SELECT setval('employees_employee_id_seq', (SELECT MAX(employee_id) FROM employees))
    `);
    
    console.log(`✅ Sequence reset to: ${result.rows[0].setval}\n`);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

fixSequence();
