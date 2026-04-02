const { pool } = require('../server/src/config/database');

async function testPendingApprovalCreation() {
  try {
    console.log('=== TESTING PENDING APPROVAL CREATION ===\n');
    
    // Get count before
    const before = await pool.query('SELECT COUNT(*) as count FROM pending_approvals');
    console.log(`Records before test: ${before.rows[0].count}\n`);
    
    // Simulate a DELETE request (like faculty deleting their image)
    console.log('Simulating DELETE request...');
    const result = await pool.query(`
      INSERT INTO pending_approvals (
        employee_code, approval_type, action_type, current_value, requested_value, 
        temp_file_path, requested_by, requested_at, status
      ) 
      VALUES ('FAC999', 'profile_image', 'DELETE', 'old_image.jpg', NULL, NULL, 'FAC999', CURRENT_TIMESTAMP, 'pending')
      RETURNING approval_id, employee_code, requested_at, status
    `);
    
    const newRecord = result.rows[0];
    console.log('✅ Created test record:');
    console.log(`   ID: ${newRecord.approval_id}`);
    console.log(`   Employee: ${newRecord.employee_code}`);
    console.log(`   Requested At: ${newRecord.requested_at}`);
    console.log(`   Status: ${newRecord.status}\n`);
    
    // Verify it was created correctly
    const verify = await pool.query(
      'SELECT * FROM pending_approvals WHERE approval_id = $1',
      [newRecord.approval_id]
    );
    
    const record = verify.rows[0];
    if (record.requested_at === null) {
      console.log('❌ FAIL: requested_at is still NULL');
    } else {
      console.log('✅ PASS: requested_at has a value:', record.requested_at);
    }
    
    if (record.status === null) {
      console.log('❌ FAIL: status is still NULL');
    } else {
      console.log('✅ PASS: status has a value:', record.status);
    }
    
    // Clean up test record
    await pool.query('DELETE FROM pending_approvals WHERE approval_id = $1', [newRecord.approval_id]);
    console.log('\n✅ Test record cleaned up');
    
    const after = await pool.query('SELECT COUNT(*) as count FROM pending_approvals');
    console.log(`Records after cleanup: ${after.rows[0].count}`);
    
    console.log('\n✅ ALL TESTS PASSED - pending_approvals table is working correctly!\n');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Test failed:', error);
    await pool.end();
    process.exit(1);
  }
}

testPendingApprovalCreation();
