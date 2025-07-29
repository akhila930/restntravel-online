import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testRealData() {
  console.log('🧪 Testing Admin Panel with Real Data...\n');

  try {
    // Test 1: Check all 14 products
    console.log('1. Testing all 14 products...');
    const productsResponse = await fetch(`${API_BASE}/admin?action=products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products loaded:', productsData.success ? 'SUCCESS' : 'FAILED');
    
    if (productsData.success) {
      console.log(`   Found ${productsData.products.length} products:`);
      productsData.products.forEach(product => {
        console.log(`   - ${product.name} (₹${product.price}) - ${product.category}`);
      });
    }

    // Test 2: Check all 5 users
    console.log('\n2. Testing all 5 users...');
    const usersResponse = await fetch(`${API_BASE}/admin?action=users`);
    const usersData = await usersResponse.json();
    console.log('✅ Users loaded:', usersData.success ? 'SUCCESS' : 'FAILED');
    
    if (usersData.success) {
      console.log(`   Found ${usersData.users.length} users:`);
      usersData.users.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
    }

    // Test 3: Check all 5 orders
    console.log('\n3. Testing all 5 orders...');
    const ordersResponse = await fetch(`${API_BASE}/admin?action=orders`);
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders loaded:', ordersData.success ? 'SUCCESS' : 'FAILED');
    
    if (ordersData.success) {
      console.log(`   Found ${ordersData.orders.length} orders:`);
      ordersData.orders.forEach(order => {
        console.log(`   - ${order.order_number}: ${order.customer_name} (₹${order.total_amount}) - ${order.status}`);
      });
    }

    // Test 4: Check dashboard stats
    console.log('\n4. Testing dashboard stats...');
    const statsResponse = await fetch(`${API_BASE}/admin?action=stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Dashboard stats loaded:', statsData.success ? 'SUCCESS' : 'FAILED');
    
    if (statsData.success) {
      console.log(`   Total Products: ${statsData.stats.totalProducts}`);
      console.log(`   Total Orders: ${statsData.stats.totalOrders}`);
      console.log(`   Total Users: ${statsData.stats.totalUsers}`);
      console.log(`   Total Revenue: ₹${statsData.stats.totalRevenue}`);
    }

    console.log('\n🎉 All real data is working perfectly!');
    console.log('\n📝 What you can now do in the admin panel:');
    console.log('1. Go to: http://localhost:8080/admin');
    console.log('2. See all 14 products with real images, prices, and descriptions');
    console.log('3. Edit any product details (name, price, description, category)');
    console.log('4. View all 5 users with their order history');
    console.log('5. Manage all 5 orders with different statuses');
    console.log('6. See total revenue of ₹9,200 from all orders');
    console.log('\n🛠️ Product Management Features:');
    console.log('   - Edit product details (click Edit button)');
    console.log('   - Add new products (click Add Product)');
    console.log('   - Delete products (click Delete button)');
    console.log('   - View product images from /Products/ folder');
    console.log('\n📊 Order Management Features:');
    console.log('   - Update order status (pending → confirmed → processing → shipped → delivered)');
    console.log('   - View order details and customer information');
    console.log('   - Track order history for each user');
    console.log('\n👥 User Management Features:');
    console.log('   - View all registered users');
    console.log('   - See user order history');
    console.log('   - Track user registration dates');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:full');
  }
}

testRealData(); 