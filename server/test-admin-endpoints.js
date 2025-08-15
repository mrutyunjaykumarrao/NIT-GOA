// Test admin endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

async function testAdminEndpoints() {
  try {
    console.log('🔐 Testing Admin Login...');
    
    // 1. Login as admin
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // 2. Test Analytics endpoint
    console.log('\n📊 Testing Analytics endpoint...');
    const analyticsResponse = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (analyticsResponse.ok) {
      const analytics = await analyticsResponse.json();
      console.log('✅ Analytics data:', analytics);
    } else {
      console.error('❌ Analytics failed:', await analyticsResponse.text());
    }
    
    // 3. Test Users endpoint
    console.log('\n👥 Testing Users endpoint...');
    const usersResponse = await fetch(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log(`✅ Users data: ${users.length} users found`);
      console.log('Sample user:', users[0]);
    } else {
      console.error('❌ Users failed:', await usersResponse.text());
    }
    
    // 4. Test Faculty endpoint
    console.log('\n🎓 Testing Faculty endpoint...');
    const facultyResponse = await fetch(`${BASE_URL}/admin/faculty`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (facultyResponse.ok) {
      const faculty = await facultyResponse.json();
      console.log(`✅ Faculty data: ${faculty.length} faculty found`);
      if (faculty.length > 0) {
        console.log('Sample faculty:', faculty[0]);
      }
    } else {
      console.error('❌ Faculty failed:', await facultyResponse.text());
    }
    
    // 5. Test Staff endpoint
    console.log('\n💼 Testing Staff endpoint...');
    const staffResponse = await fetch(`${BASE_URL}/admin/staff`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (staffResponse.ok) {
      const staff = await staffResponse.json();
      console.log(`✅ Staff data: ${staff.length} staff found`);
      if (staff.length > 0) {
        console.log('Sample staff:', staff[0]);
      }
    } else {
      console.error('❌ Staff failed:', await staffResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAdminEndpoints();
