import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testUserFlow() {
  console.log('🧪 Testing Complete User Flow...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing user registration...');
    const signupResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        email: 'john@restntravel.com',
        password: 'password123',
        name: 'John Doe',
        phone: '9876543210',
        address: '456 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001'
      })
    });

    const signupData = await signupResponse.json();
    console.log('✅ Signup result:', signupData.success ? 'SUCCESS' : 'FAILED');
    
    if (signupData.success) {
      console.log('   User created:', signupData.user.name);
      console.log('   Email:', signupData.user.email);
    }

    // Test 2: User Login
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'john@restntravel.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login result:', loginData.success ? 'SUCCESS' : 'FAILED');
    
    if (loginData.success) {
      console.log('   User authenticated:', loginData.user.name);
      console.log('   Token received:', loginData.token ? 'YES' : 'NO');
    }

    // Test 3: Order Placement
    console.log('\n3. Testing order placement...');
    const orderResponse = await fetch(`${API_BASE}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: loginData.user,
        billingInfo: {
          name: 'John Doe',
          email: 'john@restntravel.com',
          phone: '9876543210',
          street: '456 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001'
        },
        items: [
          {
            id: '1',
            name: '7 x 7" Jute/Cotton Cover Square Pillow',
            price: 100,
            quantity: 2
          },
          {
            id: '2',
            name: '7 x 12" Jute/Cotton Cover Round Pillow',
            price: 200,
            quantity: 1
          }
        ],
        total: 400
      })
    });

    const orderData = await orderResponse.json();
    console.log('✅ Order result:', orderData.success ? 'SUCCESS' : 'FAILED');
    
    if (orderData.success) {
      console.log('   Order Number:', orderData.orderNumber);
      console.log('   Total Amount: ₹', orderData.total || 400);
    }

    console.log('\n🎉 Complete user flow test completed!');
    console.log('\n📝 What to test in the browser:');
    console.log('1. Open http://localhost:3001 in your browser');
    console.log('2. Click the user icon in the header (should show login link)');
    console.log('3. Create an account or login');
    console.log('4. After login, click the user icon again (should show dropdown with user name)');
    console.log('5. Try the logout option');
    console.log('6. Add items to cart and place an order');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development server is running:');
    console.log('   npm run dev:api');
  }
}

testUserFlow(); 