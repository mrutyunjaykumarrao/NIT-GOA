const { pool } = require('../server/src/config/database');

async function fixPendingApprovals() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('=== PHASE 1: CRITICAL FIXES FOR PENDING_APPROVALS ===\n');
    
    // Step 1: Check current state
    console.log('Step 1: Checking current NULL values...');
    const nullCheck = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN requested_at IS NULL THEN 1 END) as null_requested_at,
        COUNT(CASE WHEN status IS NULL THEN 1 END) as null_status
      FROM pending_approvals
    `);
    
    console.log(`  Total records: ${nullCheck.rows[0].total}`);
    console.log(`  NULL requested_at: ${nullCheck.rows[0].null_requested_at}`);
    console.log(`  NULL status: ${nullCheck.rows[0].null_status}\n`);
    
    // Step 2: Fix NULL values in existing rows
    console.log('Step 2: Fixing NULL values in existing rows...');
    
    const fixRequestedAt = await client.query(`
      UPDATE pending_approvals 
      SET requested_at = CURRENT_TIMESTAMP 
      WHERE requested_at IS NULL
      RETURNING approval_id
    `);
    console.log(`  ✅ Fixed ${fixRequestedAt.rowCount} rows with NULL requested_at`);
    
    const fixStatus = await client.query(`
      UPDATE pending_approvals 
      SET status = 'pending' 
      WHERE status IS NULL
      RETURNING approval_id
    `);
    console.log(`  ✅ Fixed ${fixStatus.rowCount} rows with NULL status\n`);
    
    // Step 3: Add default values to table schema
    console.log('Step 3: Adding default values to schema...');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN requested_at SET DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('  ✅ Set requested_at default to CURRENT_TIMESTAMP');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN status SET DEFAULT 'pending'
    `);
    console.log('  ✅ Set status default to \'pending\'\n');
    
    // Step 4: Make columns NOT NULL (now that all NULLs are fixed)
    console.log('Step 4: Adding NOT NULL constraints...');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN requested_at SET NOT NULL
    `);
    console.log('  ✅ Made requested_at NOT NULL');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN status SET NOT NULL
    `);
    console.log('  ✅ Made status NOT NULL\n');
    
    // Step 5: Verify the fix
    console.log('Step 5: Verifying fixes...');
    const verification = await client.query(`
      SELECT 
        approval_id,
        employee_code,
        approval_type,
        action_type,
        requested_at,
        status
      FROM pending_approvals 
      ORDER BY approval_id DESC 
      LIMIT 5
    `);
    
    console.log('  Latest 5 records:');
    verification.rows.forEach(row => {
      console.log(`    ID ${row.approval_id}: ${row.employee_code} - ${row.action_type} - ${row.status} - ${row.requested_at}`);
    });
    
    await client.query('COMMIT');
    console.log('\n✅ PHASE 1 COMPLETE - All fixes applied successfully!\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during fix:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixPendingApprovals().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
