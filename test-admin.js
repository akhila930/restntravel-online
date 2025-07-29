import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAdminPanel() {
  console.log('🧪 Testing Admin Panel Functionality...\n');

  try {
    // Test 1: Get products
    console.log('1. Testing product retrieval...');
    const productsResponse = await fetch(`${API_BASE}/admin?action=products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products retrieved:', productsData.success ? 'SUCCESS' : 'FAILED');
    
    if (productsData.success) {
      console.log(`   Found ${productsData.products.length} products`);
      productsData.products.forEach(product => {
        console.log(`   - ${product.name} (₹${product.price})`);
      });
    }

    // Test 2: Get orders
    console.log('\n2. Testing order retrieval...');
    const ordersResponse = await fetch(`${API_BASE}/admin?action=orders`);
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders retrieved:', ordersData.success ? 'SUCCESS' : 'FAILED');
    
    if (ordersData.success) {
      console.log(`   Found ${ordersData.orders.length} orders`);
    }

    // Test 3: Get users
    console.log('\n3. Testing user retrieval...');
    const usersResponse = await fetch(`${API_BASE}/admin?action=users`);
    const usersData = await usersResponse.json();
    console.log('✅ Users retrieved:', usersData.success ? 'SUCCESS' : 'FAILED');
    
    if (usersData.success) {
      console.log(`   Found ${usersData.users.length} users`);
    }

    // Test 4: Get dashboard stats
    console.log('\n4. Testing dashboard stats...');
    const statsResponse = await fetch(`${API_BASE}/admin?action=stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Dashboard stats retrieved:', statsData.success ? 'SUCCESS' : 'FAILED');
    
    if (statsData.success) {
      console.log(`   Total Products: ${statsData.stats.totalProducts}`);
      console.log(`   Total Orders: ${statsData.stats.totalOrders}`);
      console.log(`   Total Users: ${statsData.stats.totalUsers}`);
      console.log(`   Total Revenue: ₹${statsData.stats.totalRevenue}`);
    }

    console.log('\n🎉 Admin panel API tests completed!');
    console.log('\n📝 How to access and use the admin panel:');
    console.log('1. Make sure you are logged in: http://localhost:8080');
    console.log('2. Go to admin panel: http://localhost:8080/admin');
    console.log('3. Click on "Products" tab to manage products');
    console.log('4. Click "Edit" button on any product to modify details');
    console.log('5. Click "Add Product" to create new products');
    console.log('\n🔧 If admin panel shows loading or errors:');
    console.log('   - Make sure you are logged in first');
    console.log('   - Check browser console for errors');
    console.log('   - Verify both servers are running');

  } catch (error) {
    console.error('❌ Admin panel test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:api');
    console.log('   npm run dev:frontend');
  }
}

testAdminPanel(); 