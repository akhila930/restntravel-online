import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testLoginFlow() {
  console.log('🧪 Testing Login Flow...\n');

  try {
    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const signupResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        email: 'admin@restntravel.com',
        password: 'admin123',
        name: 'Admin User',
        phone: '9876543210',
        address: 'Test Address',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411037'
      })
    });

    const signupData = await signupResponse.json();
    console.log('✅ Signup result:', signupData.success ? 'SUCCESS' : 'FAILED');
    
    if (signupData.success) {
      console.log('   User created:', signupData.user.name);
      console.log('   Email:', signupData.user.email);
    }

    // Test 2: Login with the created user
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@restntravel.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login result:', loginData.success ? 'SUCCESS' : 'FAILED');
    
    if (loginData.success) {
      console.log('   User authenticated:', loginData.user.name);
      console.log('   Token received:', loginData.token ? 'YES' : 'NO');
    }

    console.log('\n🎉 Login flow test completed!');
    console.log('\n📝 How to access the application:');
    console.log('1. Open your browser and go to: http://localhost:8080');
    console.log('2. Click the user icon in the header (top right)');
    console.log('3. Login with these credentials:');
    console.log('   Email: admin@restntravel.com');
    console.log('   Password: admin123');
    console.log('4. After login, you can access the admin panel at: http://localhost:8080/admin');
    console.log('\n🔧 If you still see errors, make sure both servers are running:');
    console.log('   - API Server: npm run dev:api (should be running on port 3001)');
    console.log('   - Frontend Server: npm run dev:frontend (should be running on port 8080)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:api');
    console.log('   npm run dev:frontend');
  }
}

testLoginFlow(); 