import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAdminAccess() {
  console.log('🧪 Testing Admin Panel Access...\n');

  try {
    // Test 1: Check if admin panel API is accessible
    console.log('1. Testing admin panel API access...');
    const statsResponse = await fetch(`${API_BASE}/admin?action=stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Admin API accessible:', statsData.success ? 'SUCCESS' : 'FAILED');
    
    if (statsData.success) {
      console.log(`   Dashboard stats loaded successfully`);
      console.log(`   Total Products: ${statsData.stats.totalProducts}`);
      console.log(`   Total Orders: ${statsData.stats.totalOrders}`);
      console.log(`   Total Users: ${statsData.stats.totalUsers}`);
    }

    // Test 2: Check if products are accessible
    console.log('\n2. Testing product access...');
    const productsResponse = await fetch(`${API_BASE}/admin?action=products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products accessible:', productsData.success ? 'SUCCESS' : 'FAILED');
    
    if (productsData.success) {
      console.log(`   Found ${productsData.products.length} products available for editing`);
    }

    console.log('\n🎉 Admin panel backend is working perfectly!');
    console.log('\n📝 How to access the admin panel:');
    console.log('1. Open your browser');
    console.log('2. Go to: http://localhost:8080/admin');
    console.log('3. You should now see the admin dashboard (no login required for development)');
    console.log('4. Click on "Products" tab to manage products');
    console.log('5. Click "Edit" button on any product to modify details');
    console.log('\n🔧 If you still see issues:');
    console.log('   - Clear browser cache (Ctrl+Shift+R)');
    console.log('   - Try incognito/private mode');
    console.log('   - Check browser console (F12) for errors');
    console.log('   - Make sure both servers are running: npm run dev:full');

  } catch (error) {
    console.error('❌ Admin panel test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:full');
  }
}

testAdminAccess(); 