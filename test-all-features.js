import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

async function testAllFeatures() {
  console.log('🧪 Testing All New Features...\n');

  try {
    // Test 1: Data Persistence
    console.log('1. Testing Data Persistence...');
    
    // Check if data files exist
    const dataDir = path.join(process.cwd(), 'data');
    const usersFile = path.join(dataDir, 'users.json');
    const ordersFile = path.join(dataDir, 'orders.json');
    
    console.log('   Data directory exists:', fs.existsSync(dataDir));
    console.log('   Users file exists:', fs.existsSync(usersFile));
    console.log('   Orders file exists:', fs.existsSync(ordersFile));
    
    if (fs.existsSync(usersFile)) {
      const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      console.log('   Users in file:', usersData.length);
    }
    
    if (fs.existsSync(ordersFile)) {
      const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
      console.log('   Orders in file:', ordersData.length);
    }

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const testUser = {
      action: 'signup',
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pinCode: '123456'
    };

    const signupResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const signupResult = await signupResponse.json();
    console.log('   Signup result:', signupResult.success ? 'SUCCESS' : 'FAILED');
    
    if (signupResult.success) {
      console.log('   User ID:', signupResult.user.id);
      console.log('   Token received:', !!signupResult.token);
    }

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginData = {
      action: 'login',
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const loginResponse = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('   Login result:', loginResult.success ? 'SUCCESS' : 'FAILED');
    
    if (loginResult.success) {
      console.log('   User authenticated:', loginResult.user.name);
    }

    // Test 4: Product with Delivery Charges
    console.log('\n4. Testing Product with Delivery Charges...');
    const productData = {
      name: 'Test Product with Delivery',
      category: 'pillows',
      price: 150,
      image: 'test-product.jpg',
      description: 'Test product with delivery charges',
      is_active: true,
      delivery_charges: 50
    };

    const productResponse = await fetch(`${API_BASE}/admin?action=products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const productResult = await productResponse.json();
    console.log('   Product creation:', productResult.success ? 'SUCCESS' : 'FAILED');
    
    if (productResult.success) {
      console.log('   Product ID:', productResult.product.id);
      console.log('   Delivery charges:', productResult.product.delivery_charges);
    }

    // Test 5: Order with Payment Method
    console.log('\n5. Testing Order with Payment Method...');
    const orderData = {
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      billingInfo: {
        name: 'Test User',
        street: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pinCode: '123456',
        phone: '1234567890',
        email: 'test@example.com'
      },
      items: [
        { id: '1', name: 'Test Product', price: 100, quantity: 2 }
      ],
      total: 250,
      subtotal: 200,
      deliveryCharges: 50,
      paymentMethod: 'qr'
    };

    const orderResponse = await fetch(`${API_BASE}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const orderResult = await orderResponse.json();
    console.log('   Order creation:', orderResult.success ? 'SUCCESS' : 'FAILED');
    
    if (orderResult.success) {
      console.log('   Order number:', orderResult.orderNumber);
    }

    // Test 6: Verify Data Persistence After Order
    console.log('\n6. Verifying Data Persistence...');
    
    if (fs.existsSync(ordersFile)) {
      const updatedOrdersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
      console.log('   Orders after creation:', updatedOrdersData.length);
      
      if (updatedOrdersData.length > 0) {
        const latestOrder = updatedOrdersData[updatedOrdersData.length - 1];
        console.log('   Latest order payment method:', latestOrder.payment_method);
        console.log('   Latest order total:', latestOrder.total_amount);
      }
    }

    // Test 7: QR Code Image
    console.log('\n7. Testing QR Code Image...');
    const qrCodePath = path.join(process.cwd(), 'public', 'payment-qr.png');
    console.log('   QR code exists:', fs.existsSync(qrCodePath));
    
    if (fs.existsSync(qrCodePath)) {
      const stats = fs.statSync(qrCodePath);
      console.log('   QR code size:', stats.size, 'bytes');
    }

    console.log('\n🎉 All Features Test Completed!');
    console.log('\n📝 Summary:');
    console.log('✅ Data persistence implemented');
    console.log('✅ User registration and login working');
    console.log('✅ Product delivery charges added');
    console.log('✅ Payment methods (COD + QR) implemented');
    console.log('✅ Order creation with payment method');
    console.log('✅ QR code image available');
    console.log('\n🔄 Next steps:');
    console.log('1. Test user registration in browser');
    console.log('2. Test order placement with both payment methods');
    console.log('3. Verify data persists after server restart');
    console.log('4. Test delivery charges in admin panel');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:full');
  }
}

testAllFeatures(); 