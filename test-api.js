import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing RestNTravel API...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing user registration...');
    const signupResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        email: 'test@restntravel.com',
        password: 'test123',
        name: 'Test User',
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pinCode: '123456'
      })
    });

    const signupData = await signupResponse.json();
    console.log('✅ Signup result:', signupData.success ? 'SUCCESS' : 'FAILED');
    
    if (signupData.success) {
      console.log('   User ID:', signupData.user.id);
      console.log('   Token received:', signupData.token ? 'YES' : 'NO');
    }

    // Test 2: User Login
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'test@restntravel.com',
        password: 'test123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login result:', loginData.success ? 'SUCCESS' : 'FAILED');
    
    if (loginData.success) {
      console.log('   User authenticated:', loginData.user.name);
    }

    // Test 3: Order Placement
    console.log('\n3. Testing order placement...');
    const orderResponse = await fetch(`${API_BASE}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: loginData.user,
        billingInfo: {
          name: 'Test User',
          email: 'test@restntravel.com',
          phone: '1234567890',
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pinCode: '123456'
        },
        items: [
          {
            id: '1',
            name: '7 x 7" Jute/Cotton Cover Square Pillow',
            price: 100,
            quantity: 2
          }
        ],
        total: 200
      })
    });

    const orderData = await orderResponse.json();
    console.log('✅ Order result:', orderData.success ? 'SUCCESS' : 'FAILED');
    
    if (orderData.success) {
      console.log('   Order Number:', orderData.orderNumber);
      console.log('   Total Amount: ₹', orderData.total || 200);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Open http://localhost:3001 in your browser');
    console.log('2. Try creating an account and placing an order');
    console.log('3. Check the server console for order logs');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development server is running:');
    console.log('   npm run dev:api');
  }
}

testAPI(); 