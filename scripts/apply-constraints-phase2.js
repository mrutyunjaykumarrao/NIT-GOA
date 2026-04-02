const { pool } = require('../server/src/config/database');

async function applyConstraints() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('=== PHASE 2: ADDING NOT NULL AND UNIQUE CONSTRAINTS ===\n');
    
    // pending_approvals constraints
    console.log('1. pending_approvals table:');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN employee_code SET NOT NULL
    `);
    console.log('   ✅ employee_code NOT NULL');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN approval_type SET NOT NULL
    `);
    console.log('   ✅ approval_type NOT NULL');
    
    await client.query(`
      ALTER TABLE pending_approvals 
      ALTER COLUMN requested_by SET NOT NULL
    `);
    console.log('   ✅ requested_by NOT NULL\n');
    
    // employees constraints
    console.log('2. employees table:');
    
    await client.query(`
      ALTER TABLE employees 
      ALTER COLUMN employee_code SET NOT NULL
    `);
    console.log('   ✅ employee_code NOT NULL');
    
    await client.query(`
      ALTER TABLE employees 
      ALTER COLUMN full_name SET NOT NULL
    `);
    console.log('   ✅ full_name NOT NULL');
    
    await client.query(`
      ALTER TABLE employees 
      ALTER COLUMN email SET NOT NULL
    `);
    console.log('   ✅ email NOT NULL');
    
    // Check if unique constraints already exist
    const existingConstraints = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'employees' 
      AND constraint_type = 'UNIQUE'
    `);
    
    const hasCodeConstraint = existingConstraints.rows.some(r => r.constraint_name.includes('employee_code'));
    const hasEmailConstraint = existingConstraints.rows.some(r => r.constraint_name.includes('email'));
    
    if (!hasCodeConstraint) {
      await client.query(`
        ALTER TABLE employees 
        ADD CONSTRAINT employees_employee_code_unique UNIQUE (employee_code)
      `);
      console.log('   ✅ employee_code UNIQUE constraint added');
    } else {
      console.log('   ℹ️  employee_code UNIQUE constraint already exists');
    }
    
    if (!hasEmailConstraint) {
      await client.query(`
        ALTER TABLE employees 
        ADD CONSTRAINT employees_email_unique UNIQUE (email)
      `);
      console.log('   ✅ email UNIQUE constraint added\n');
    } else {
      console.log('   ℹ️  email UNIQUE constraint already exists\n');
    }
    
    // user_accounts constraints
    console.log('3. user_accounts table:');
    
    await client.query(`
      ALTER TABLE user_accounts 
      ALTER COLUMN username SET NOT NULL
    `);
    console.log('   ✅ username NOT NULL');
    
    await client.query(`
      ALTER TABLE user_accounts 
      ALTER COLUMN password_hash SET NOT NULL
    `);
    console.log('   ✅ password_hash NOT NULL');
    
    const uaConstraints = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'user_accounts' 
      AND constraint_type = 'UNIQUE'
    `);
    
    const hasUsernameConstraint = uaConstraints.rows.some(r => r.constraint_name.includes('username'));
    
    if (!hasUsernameConstraint) {
      await client.query(`
        ALTER TABLE user_accounts 
        ADD CONSTRAINT user_accounts_username_unique UNIQUE (username)
      `);
      console.log('   ✅ username UNIQUE constraint added\n');
    } else {
      console.log('   ℹ️  username UNIQUE constraint already exists\n');
    }
    
    await client.query('COMMIT');
    console.log('✅ PHASE 2 COMPLETE - All constraints applied successfully!\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during constraint application:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

applyConstraints();
