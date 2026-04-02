const { pool } = require('../server/src/config/database');

async function checkNullValues() {
  try {
    console.log('=== PHASE 2: CHECKING FOR NULL VALUES IN CRITICAL COLUMNS ===\n');
    
    // Check pending_approvals
    console.log('1. pending_approvals:');
    const pa = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN employee_code IS NULL THEN 1 END) as null_employee_code,
        COUNT(CASE WHEN approval_type IS NULL THEN 1 END) as null_approval_type,
        COUNT(CASE WHEN requested_by IS NULL THEN 1 END) as null_requested_by
      FROM pending_approvals
    `);
    console.log(`   Total: ${pa.rows[0].total}`);
    console.log(`   NULL employee_code: ${pa.rows[0].null_employee_code}`);
    console.log(`   NULL approval_type: ${pa.rows[0].null_approval_type}`);
    console.log(`   NULL requested_by: ${pa.rows[0].null_requested_by}\n`);
    
    // Check employees
    console.log('2. employees:');
    const emp = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN employee_code IS NULL THEN 1 END) as null_code,
        COUNT(CASE WHEN full_name IS NULL THEN 1 END) as null_name,
        COUNT(CASE WHEN email IS NULL THEN 1 END) as null_email
      FROM employees
    `);
    console.log(`   Total: ${emp.rows[0].total}`);
    console.log(`   NULL employee_code: ${emp.rows[0].null_code}`);
    console.log(`   NULL full_name: ${emp.rows[0].null_name}`);
    console.log(`   NULL email: ${emp.rows[0].null_email}\n`);
    
    // Check for duplicate employee_codes
    const dupCodes = await pool.query(`
      SELECT employee_code, COUNT(*) as count 
      FROM employees 
      GROUP BY employee_code 
      HAVING COUNT(*) > 1
    `);
    if (dupCodes.rowCount > 0) {
      console.log(`   ⚠️  Duplicate employee_codes found: ${dupCodes.rowCount}`);
      dupCodes.rows.forEach(row => {
        console.log(`      ${row.employee_code}: ${row.count} times`);
      });
    } else {
      console.log('   ✅ No duplicate employee_codes');
    }
    
    // Check for duplicate emails
    const dupEmails = await pool.query(`
      SELECT email, COUNT(*) as count 
      FROM employees 
      WHERE email IS NOT NULL
      GROUP BY email 
      HAVING COUNT(*) > 1
    `);
    if (dupEmails.rowCount > 0) {
      console.log(`   ⚠️  Duplicate emails found: ${dupEmails.rowCount}`);
      dupEmails.rows.forEach(row => {
        console.log(`      ${row.email}: ${row.count} times`);
      });
    } else {
      console.log('   ✅ No duplicate emails\n');
    }
    
    // Check user_accounts
    console.log('3. user_accounts:');
    const ua = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN username IS NULL THEN 1 END) as null_username,
        COUNT(CASE WHEN password_hash IS NULL THEN 1 END) as null_password
      FROM user_accounts
    `);
    console.log(`   Total: ${ua.rows[0].total}`);
    console.log(`   NULL username: ${ua.rows[0].null_username}`);
    console.log(`   NULL password_hash: ${ua.rows[0].null_password}\n`);
    
    // Check for duplicate usernames
    const dupUsernames = await pool.query(`
      SELECT username, COUNT(*) as count 
      FROM user_accounts 
      GROUP BY username 
      HAVING COUNT(*) > 1
    `);
    if (dupUsernames.rowCount > 0) {
      console.log(`   ⚠️  Duplicate usernames found: ${dupUsernames.rowCount}`);
      dupUsernames.rows.forEach(row => {
        console.log(`      ${row.username}: ${row.count} times`);
      });
    } else {
      console.log('   ✅ No duplicate usernames\n');
    }
    
    // Summary
    console.log('=== SUMMARY ===');
    const safeToAddConstraints = 
      pa.rows[0].null_employee_code === '0' &&
      pa.rows[0].null_approval_type === '0' &&
      pa.rows[0].null_requested_by === '0' &&
      emp.rows[0].null_code === '0' &&
      emp.rows[0].null_name === '0' &&
      emp.rows[0].null_email === '0' &&
      ua.rows[0].null_username === '0' &&
      ua.rows[0].null_password === '0' &&
      dupCodes.rowCount === 0 &&
      dupEmails.rowCount === 0 &&
      dupUsernames.rowCount === 0;
    
    if (safeToAddConstraints) {
      console.log('✅ SAFE TO ADD NOT NULL AND UNIQUE CONSTRAINTS');
      console.log('   No NULL values or duplicates found in critical columns.\n');
    } else {
      console.log('⚠️  NOT SAFE - Found NULL values or duplicates');
      console.log('   Fix these issues before adding constraints.\n');
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

checkNullValues();
