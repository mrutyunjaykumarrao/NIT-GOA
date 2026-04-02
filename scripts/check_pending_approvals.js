const { pool } = require('../server/src/config/database');

async function checkPendingApprovals() {
  try {
    const result = await pool.query(`
      SELECT 
        approval_id,
        employee_code,
        approval_type,
        action_type,
        requested_at,
        status,
        admin_notes
      FROM pending_approvals 
      ORDER BY approval_id DESC 
      LIMIT 10
    `);
    
    console.log('=== RECENT PENDING APPROVALS ===\n');
    console.log('Total records:', result.rowCount);
    console.log('\nLast 10 records:\n');
    
    result.rows.forEach(row => {
      console.log(`ID: ${row.approval_id}`);
      console.log(`  Employee: ${row.employee_code}`);
      console.log(`  Type: ${row.approval_type}`);
      console.log(`  Action: ${row.action_type}`);
      console.log(`  Requested At: ${row.requested_at}`);
      console.log(`  Status: ${row.status}`);
      console.log(`  Notes: ${row.admin_notes || 'N/A'}`);
      console.log('');
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPendingApprovals();
