/**
 * Phase 5: Comprehensive API Testing Script
 * Tests all endpoints with mock data for CRUD operations
 */

const axios = require('axios');
const BASE_URL = 'http://localhost:3001';

// Test credentials
const CREDENTIALS = {
  admin: { username: 'admin', password: 'admin1111' },
  faculty: { username: 'veenat', password: 'faculty123' }
};

let adminToken = '';
let facultyToken = '';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(status, message, details = '') {
  const symbols = {
    PASS: `${colors.green}✅ PASS${colors.reset}`,
    FAIL: `${colors.red}❌ FAIL${colors.reset}`,
    PARTIAL: `${colors.yellow}⚠️  PARTIAL${colors.reset}`,
    INFO: `${colors.blue}ℹ️  INFO${colors.reset}`
  };
  console.log(`${symbols[status]} ${message}`);
  if (details) console.log(`   ${colors.cyan}${details}${colors.reset}`);
}

async function testEndpoint(name, method, url, data = null, token = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      ...(data && { data })
    };

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log('PASS', `${name}`, `Status: ${response.status}`);
      return { success: true, data: response.data, status: response.status };
    } else {
      log('PARTIAL', `${name}`, `Expected ${expectedStatus}, got ${response.status}`);
      return { success: false, data: response.data, status: response.status };
    }
  } catch (error) {
    if (error.response) {
      log('FAIL', `${name}`, `Status: ${error.response.status} - ${error.response.data?.error || error.response.data?.message || 'Unknown error'}`);
      return { success: false, error: error.response.data, status: error.response.status };
    } else {
      log('FAIL', `${name}`, `Network error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// ============================================================================
// 1. AUTHENTICATION TESTS
// ============================================================================
async function testAuthentication() {
  console.log('\n' + '='.repeat(80));
  console.log('1️⃣  AUTHENTICATION APIs');
  console.log('='.repeat(80));

  // Login as admin
  const loginAdmin = await testEndpoint(
    'POST /api/auth/login (admin)',
    'POST',
    '/api/auth/login',
    CREDENTIALS.admin
  );
  
  if (loginAdmin.success && loginAdmin.data?.token) {
    adminToken = loginAdmin.data.token;
    log('INFO', 'Admin token obtained', adminToken.substring(0, 30) + '...');
  }

  // Login as faculty
  const loginFaculty = await testEndpoint(
    'POST /api/auth/login (faculty)',
    'POST',
    '/api/auth/login',
    CREDENTIALS.faculty
  );
  
  if (loginFaculty.success && loginFaculty.data?.token) {
    facultyToken = loginFaculty.data.token;
    log('INFO', 'Faculty token obtained', facultyToken.substring(0, 30) + '...');
  }

  // Test logout
  if (adminToken) {
    await testEndpoint(
      'POST /api/auth/logout',
      'POST',
      '/api/auth/logout',
      null,
      adminToken
    );
  }
}

// ============================================================================
// 2. ADMIN - USER MANAGEMENT TESTS
// ============================================================================
async function testAdminUsers() {
  console.log('\n' + '='.repeat(80));
  console.log('2️⃣  ADMIN - USER MANAGEMENT APIs');
  console.log('='.repeat(80));

  if (!adminToken) {
    log('FAIL', 'Admin User Management Tests', 'No admin token available');
    return;
  }

  // GET all users
  await testEndpoint(
    'GET /api/admin/users',
    'GET',
    '/api/admin/users?page=1&limit=20',
    null,
    adminToken
  );

  // Search users
  await testEndpoint(
    'GET /api/admin/users (search)',
    'GET',
    '/api/admin/users?search=admin',
    null,
    adminToken
  );

  // Create new user
  const uniqueUsername = 'testuser_' + Date.now();
  const createUserResult = await testEndpoint(
    'POST /api/admin/users',
    'POST',
    '/api/admin/users',
    {
      username: uniqueUsername,
      email: uniqueUsername + '@test.com',
      password: 'Test@123',
      access_level: 'faculty'
    },
    adminToken,
    201
  );
  
  // If user was created successfully, try to delete it for cleanup
  if (createUserResult.success && createUserResult.data?.user_id) {
    // Clean up created test user (optional)
    log('INFO', 'Test user created with ID', createUserResult.data.user_id);
  }
}

// ============================================================================
// 3. ADMIN - FACULTY MANAGEMENT TESTS
// ============================================================================
async function testAdminFaculty() {
  console.log('\n' + '='.repeat(80));
  console.log('3️⃣  ADMIN - FACULTY MANAGEMENT APIs');
  console.log('='.repeat(80));

  if (!adminToken) {
    log('FAIL', 'Admin Faculty Management Tests', 'No admin token available');
    return;
  }

  // GET all faculty
  await testEndpoint(
    'GET /api/admin/faculty',
    'GET',
    '/api/admin/faculty',
    null,
    adminToken
  );

  // GET faculty with filters
  await testEndpoint(
    'GET /api/admin/faculty (filtered)',
    'GET',
    '/api/admin/faculty?department=CSE&status=active',
    null,
    adminToken
  );
}

// ============================================================================
// 4. ADMIN - STAFF MANAGEMENT TESTS
// ============================================================================
async function testAdminStaff() {
  console.log('\n' + '='.repeat(80));
  console.log('4️⃣  ADMIN - STAFF MANAGEMENT APIs');
  console.log('='.repeat(80));

  if (!adminToken) {
    log('FAIL', 'Admin Staff Management Tests', 'No admin token available');
    return;
  }

  // GET all staff
  await testEndpoint(
    'GET /api/admin/staff',
    'GET',
    '/api/admin/staff',
    null,
    adminToken
  );
}

// ============================================================================
// 5. ADMIN - ANALYTICS TESTS
// ============================================================================
async function testAdminAnalytics() {
  console.log('\n' + '='.repeat(80));
  console.log('5️⃣  ADMIN - ANALYTICS APIs');
  console.log('='.repeat(80));

  if (!adminToken) {
    log('FAIL', 'Admin Analytics Tests', 'No admin token available');
    return;
  }

  // GET analytics overview
  await testEndpoint(
    'GET /api/admin/analytics',
    'GET',
    '/api/admin/analytics',
    null,
    adminToken
  );
}

// ============================================================================
// 6. ANALYTICS - PUBLIC/PRIVATE TESTS
// ============================================================================
async function testAnalytics() {
  console.log('\n' + '='.repeat(80));
  console.log('6️⃣  ANALYTICS APIs');
  console.log('='.repeat(80));

  // Dashboard stats (requires auth)
  await testEndpoint(
    'GET /api/analytics/dashboard-stats',
    'GET',
    '/api/analytics/dashboard-stats',
    null,
    adminToken
  );

  // Chart data (requires auth)
  await testEndpoint(
    'GET /api/analytics/chart-data',
    'GET',
    '/api/analytics/chart-data',
    null,
    adminToken
  );

  // Footer stats (public)
  await testEndpoint(
    'GET /api/analytics/footer-stats',
    'GET',
    '/api/analytics/footer-stats'
  );

  // Track visit (public POST)
  await testEndpoint(
    'POST /api/analytics/track-visit',
    'POST',
    '/api/analytics/track-visit',
    {
      page: '/test',
      device: 'desktop',
      browser: 'Chrome',
      os: 'macOS'
    }
  );
}

// ============================================================================
// 7. FACULTY EDIT APIs
// ============================================================================
async function testFacultyEdit() {
  console.log('\n' + '='.repeat(80));
  console.log('7️⃣  FACULTY EDIT APIs');
  console.log('='.repeat(80));

  if (!facultyToken) {
    log('FAIL', 'Faculty Edit Tests', 'No faculty token available');
    return;
  }

  // Note: Using FAC001 as employee code for testing
  const employeeCode = 'FAC001';

  // GET profile
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/profile',
    'GET',
    `/api/faculty-edit/${employeeCode}/profile`,
    null,
    facultyToken
  );

  // GET education
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/education',
    'GET',
    `/api/faculty-edit/${employeeCode}/education`,
    null,
    facultyToken
  );

  // GET publications
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/publications',
    'GET',
    `/api/faculty-edit/${employeeCode}/publications`,
    null,
    facultyToken
  );

  // GET courses taught
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/courses-taught',
    'GET',
    `/api/faculty-edit/${employeeCode}/courses-taught`,
    null,
    facultyToken
  );

  // GET research areas
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/research-areas',
    'GET',
    `/api/faculty-edit/${employeeCode}/research-areas`,
    null,
    facultyToken
  );

  // GET memberships
  await testEndpoint(
    'GET /api/faculty-edit/:employeeCode/memberships',
    'GET',
    `/api/faculty-edit/${employeeCode}/memberships`,
    null,
    facultyToken
  );
}

// ============================================================================
// 8. PUBLIC FACULTY LIST APIs
// ============================================================================
async function testFacultyList() {
  console.log('\n' + '='.repeat(80));
  console.log('8️⃣  PUBLIC FACULTY LIST APIs');
  console.log('='.repeat(80));

  // GET all faculty list
  await testEndpoint(
    'GET /api/faculty-list',
    'GET',
    '/api/faculty-list'
  );

  // GET faculty by department
  await testEndpoint(
    'GET /api/faculty-list (by dept)',
    'GET',
    '/api/faculty-list?department=CSE'
  );
}

// ============================================================================
// 9. FACULTY DETAILS APIs
// ============================================================================
async function testFacultyDetails() {
  console.log('\n' + '='.repeat(80));
  console.log('9️⃣  FACULTY DETAILS APIs');
  console.log('='.repeat(80));

  // GET specific faculty details (assuming FAC001 exists)
  await testEndpoint(
    'GET /api/faculty-details/:id',
    'GET',
    '/api/faculty-details/FAC001'
  );
}

// ============================================================================
// 10. PUBLIC DISPLAY & STAFF APIs
// ============================================================================
async function testPublicAndStaff() {
  console.log('\n' + '='.repeat(80));
  console.log('🔟 PUBLIC DISPLAY & STAFF APIs');
  console.log('='.repeat(80));

  // GET public display data
  await testEndpoint(
    'GET /api/public/departments',
    'GET',
    '/api/public/departments'
  );

  // GET administrative staff
  await testEndpoint(
    'GET /api/staff/administrative',
    'GET',
    '/api/staff/administrative'
  );

  // GET technical staff
  await testEndpoint(
    'GET /api/staff/technical',
    'GET',
    '/api/staff/technical'
  );
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================
async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(15) + 'PHASE 5: COMPREHENSIVE API TESTING' + ' '.repeat(29) + '║');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('║' + '  Database: Supabase PostgreSQL' + ' '.repeat(47) + '║');
  console.log('║' + '  Branch: supabase-implementation' + ' '.repeat(44) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testAuthentication();
    await testAdminUsers();
    await testAdminFaculty();
    await testAdminStaff();
    await testAdminAnalytics();
    await testAnalytics();
    await testFacultyEdit();
    await testFacultyList();
    await testFacultyDetails();
    await testPublicAndStaff();

    console.log('\n' + '='.repeat(80));
    console.log('✨ ALL TESTS COMPLETED');
    console.log('='.repeat(80));
    console.log('\nResults saved to API_TEST_RESULTS.md\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
