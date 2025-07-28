#!/usr/bin/env node

/**
 * Test script for the updated database implementation
 */

const { testConnection, validateSchema, initializeDatabase } = require('./src/config/database.updated');
const { Employee, SystemSetting } = require('./src/models/index.updated');

async function runTests() {
  console.log('🧪 Running Updated Database Tests...\n');
  
  let testsPassed = 0;
  let testsFailed = 0;
  
  const test = async (name, testFn) => {
    try {
      console.log(`🔄 Testing: ${name}`);
      await testFn();
      console.log(`✅ ${name} - PASSED\n`);
      testsPassed++;
    } catch (error) {
      console.error(`❌ ${name} - FAILED: ${error.message}\n`);
      testsFailed++;
    }
  };
  
  // Test 1: Database Connection
  await test('Database Connection', async () => {
    const connected = await testConnection();
    if (!connected) throw new Error('Could not connect to database');
  });
  
  // Test 2: Schema Validation
  await test('Schema Validation', async () => {
    const valid = await validateSchema();
    if (!valid) throw new Error('Schema validation failed');
  });
  
  // Test 3: Database Initialization
  await test('Database Initialization', async () => {
    const initialized = await initializeDatabase();
    if (!initialized) throw new Error('Database initialization failed');
  });
  
  // Test 4: System Settings Model
  await test('System Settings Model', async () => {
    const systemSettingModel = new SystemSetting();
    const settings = await systemSettingModel.getPublicSettings();
    
    if (!settings || typeof settings !== 'object') {
      throw new Error('Failed to get public settings');
    }
    
    if (!settings.site_name) {
      throw new Error('site_name setting not found');
    }
    
    console.log('   📝 Found settings:', Object.keys(settings));
  });
  
  // Test 5: Employee Model
  await test('Employee Model', async () => {
    const employeeModel = new Employee();
    
    // Test basic find operation
    const employees = await employeeModel.find({
      limit: 5,
      where: { is_active: true }
    });
    
    console.log(`   📝 Found ${employees.length} active employees`);
    
    // Test count operation
    const count = await employeeModel.count({ is_active: true });
    console.log(`   📝 Total active employees: ${count}`);
  });
  
  // Test 6: Create Test Employee
  await test('Create Test Employee', async () => {
    const { executeQuery, withTransaction } = require('./src/config/database.updated');
    const bcrypt = require('bcrypt');
    
    // Clean up any existing test data
    await executeQuery('DELETE FROM employees WHERE email = ?', ['test@nitgoa.ac.in']);
    await executeQuery('DELETE FROM user_accounts WHERE username = ?', ['testuser']);
    
    const result = await withTransaction(async (connection) => {
      // Create user account
      const hashedPassword = await bcrypt.hash('test123', 12);
      const [userResult] = await connection.execute(`
        INSERT INTO user_accounts (username, password_hash, access_level, is_active)
        VALUES (?, ?, 'Faculty', true)
      `, ['testuser', hashedPassword]);
      
      // Create employee
      const [employeeResult] = await connection.execute(`
        INSERT INTO employees (
          user_account_id, employee_code, full_name, email, role, 
          employment_status, is_active, is_public_visible
        ) VALUES (?, ?, ?, ?, 'Faculty', 'Permanent', true, true)
      `, [userResult.insertId, 'TEST001', 'Test Faculty', 'test@nitgoa.ac.in']);
      
      // Create faculty profile
      await connection.execute(`
        INSERT INTO faculty_profiles (employee_id, bio_summary)
        VALUES (?, ?)
      `, [employeeResult.insertId, 'This is a test faculty profile']);
      
      return { employeeId: employeeResult.insertId };
    });
    
    console.log(`   📝 Created test employee with ID: ${result.employeeId}`);
    
    // Verify creation
    const employeeModel = new Employee();
    const testEmployee = await employeeModel.findById(result.employeeId);
    
    if (!testEmployee || testEmployee.email !== 'test@nitgoa.ac.in') {
      throw new Error('Test employee not created properly');
    }
    
    console.log(`   📝 Verified test employee: ${testEmployee.full_name}`);
  });
  
  // Test 7: API Endpoint Simulation
  await test('API Endpoint Simulation', async () => {
    const employeeModel = new Employee();
    
    // Simulate public API call
    const publicEmployees = await employeeModel.getByRole('Faculty', {
      limit: 5,
      where: { is_public_visible: true }
    });
    
    console.log(`   📝 Public faculty members: ${publicEmployees.length}`);
    
    // Find test employee and get full profile
    const testEmployee = await employeeModel.find({
      where: { email: 'test@nitgoa.ac.in' },
      limit: 1
    });
    
    if (testEmployee.length > 0) {
      const fullProfile = await employeeModel.getFullProfile(testEmployee[0].employee_id);
      console.log(`   📝 Test employee full profile loaded: ${fullProfile ? 'Yes' : 'No'}`);
    }
  });
  
  // Test 8: Clean up
  await test('Cleanup Test Data', async () => {
    const { executeQuery } = require('./src/config/database.updated');
    
    // Remove test data
    await executeQuery('DELETE FROM faculty_profiles WHERE employee_id IN (SELECT employee_id FROM employees WHERE email = ?)', ['test@nitgoa.ac.in']);
    await executeQuery('DELETE FROM employees WHERE email = ?', ['test@nitgoa.ac.in']);
    await executeQuery('DELETE FROM user_accounts WHERE username = ?', ['testuser']);
    
    console.log('   📝 Test data cleaned up');
  });
  
  // Final Results
  console.log('🏁 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! The updated database is working correctly.');
    console.log('\n📝 You can now:');
    console.log('1. Start the updated server: npm run dev:updated');
    console.log('2. Test API endpoints: curl http://localhost:3001/api/health');
    console.log('3. Access API docs: http://localhost:3001/api/docs');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
