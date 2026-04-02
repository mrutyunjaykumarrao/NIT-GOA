const { pool } = require('../server/src/config/database');

async function addIndexes() {
  const client = await pool.connect();
  
  try {
    console.log('=== PHASE 3: ADDING PERFORMANCE INDEXES ===\n');
    
    // Helper function to check if index exists
    async function indexExists(indexName) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE indexname = $1
        ) as exists
      `, [indexName]);
      return result.rows[0].exists;
    }
    
    const indexes = [
      {
        name: 'idx_pending_approvals_employee_code',
        sql: 'CREATE INDEX idx_pending_approvals_employee_code ON pending_approvals(employee_code)',
        desc: 'pending_approvals.employee_code'
      },
      {
        name: 'idx_pending_approvals_status',
        sql: 'CREATE INDEX idx_pending_approvals_status ON pending_approvals(status)',
        desc: 'pending_approvals.status'
      },
      {
        name: 'idx_faculty_profiles_department_id',
        sql: 'CREATE INDEX idx_faculty_profiles_department_id ON faculty_profiles(department_id)',
        desc: 'faculty_profiles.department_id'
      },
      {
        name: 'idx_staff_profiles_department_id',
        sql: 'CREATE INDEX idx_staff_profiles_department_id ON staff_profiles(department_id)',
        desc: 'staff_profiles.department_id'
      },
      {
        name: 'idx_employees_employee_code',
        sql: 'CREATE INDEX idx_employees_employee_code ON employees(employee_code)',
        desc: 'employees.employee_code'
      },
      {
        name: 'idx_user_accounts_username',
        sql: 'CREATE INDEX idx_user_accounts_username ON user_accounts(username)',
        desc: 'user_accounts.username'
      },
      {
        name: 'idx_employees_role',
        sql: 'CREATE INDEX idx_employees_role ON employees(role)',
        desc: 'employees.role (for filtering Faculty/Admin/Staff)'
      },
      {
        name: 'idx_faculty_profiles_employee_code',
        sql: 'CREATE INDEX idx_faculty_profiles_employee_code ON faculty_profiles(employee_code)',
        desc: 'faculty_profiles.employee_code (JOIN optimization)'
      },
      {
        name: 'idx_staff_profiles_employee_code',
        sql: 'CREATE INDEX idx_staff_profiles_employee_code ON staff_profiles(employee_code)',
        desc: 'staff_profiles.employee_code (JOIN optimization)'
      }
    ];
    
    let created = 0;
    let skipped = 0;
    
    for (const index of indexes) {
      const exists = await indexExists(index.name);
      
      if (exists) {
        console.log(`   ℹ️  ${index.desc} - already exists`);
        skipped++;
      } else {
        await client.query(index.sql);
        console.log(`   ✅ ${index.desc} - created`);
        created++;
      }
    }
    
    console.log(`\n✅ PHASE 3 COMPLETE`);
    console.log(`   Created: ${created} indexes`);
    console.log(`   Skipped: ${skipped} indexes (already existed)\n`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error during index creation:', error);
    await pool.end();
    process.exit(1);
  }
}

addIndexes();
