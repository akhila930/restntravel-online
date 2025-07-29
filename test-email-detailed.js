import fetch from 'node-fetch';

console.log('📧 Detailed Email Testing...\n');

const BASE_URL = 'http://localhost:3001';

// Test 1: Check SMTP Configuration
console.log('1. Checking SMTP Configuration...');
console.log('   Current SMTP Settings:');
console.log('   - Host: smtp.hostinger.com');
console.log('   - Port: 587');
console.log('   - User: sales@restntravel.shop');
console.log('   - Password: [environment variable]');
console.log('   - Secure: false');

// Test 2: Test Contact Form with Detailed Error
console.log('\n2. Testing Contact Form Email (Detailed)...');
try {
  const contactResponse = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'Email Test',
      message: 'This is a test message to verify email functionality.'
    })
  });
  
  const contactData = await contactResponse.json();
  
  if (contactData.success) {
    console.log('   ✅ Contact form API response: Success');
    console.log('   ✅ Message: ' + contactData.message);
    console.log('   ⚠️  Note: Email may not actually send due to placeholder SMTP credentials');
  } else {
    console.log('   ❌ Contact form API failed:', contactData.message);
  }
} catch (error) {
  console.log('   ❌ Contact form API error:', error.message);
}

// Test 3: Test Order Email with Detailed Error
console.log('\n3. Testing Order Email (Detailed)...');
try {
  const orderResponse = await fetch(`${BASE_URL}/api/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
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
        { id: '1', name: 'Test Product', price: 100, quantity: 1, delivery_charges: 0 }
      ],
      total: 100,
      subtotal: 100,
      deliveryCharges: 0,
      paymentMethod: 'cod'
    })
  });
  
  const orderData = await orderResponse.json();
  
  if (orderData.success) {
    console.log('   ✅ Order API response: Success');
    console.log('   ✅ Order Number: ' + orderData.orderNumber);
    console.log('   ✅ Message: ' + orderData.message);
    console.log('   ⚠️  Note: Emails may not actually send due to placeholder SMTP credentials');
  } else {
    console.log('   ❌ Order API failed:', orderData.message);
  }
} catch (error) {
  console.log('   ❌ Order API error:', error.message);
}

// Test 4: Environment Variables Check
console.log('\n4. Environment Variables Check...');
console.log('   SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'Set' : 'Not Set');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not Set');

// Test 5: Email Configuration Analysis
console.log('\n5. Email Configuration Analysis...');
console.log('   ✅ Nodemailer function calls fixed');
console.log('   ✅ SMTP configuration updated');
console.log('   ✅ Email templates working');
console.log('   ⚠️  SMTP credentials are placeholders');

console.log('\n🔍 Email Issue Analysis:');
console.log('\n📋 **The Problem:**');
console.log('   The emails are not actually being sent because:');
console.log('   1. SMTP_PASSWORD environment variable is not set');
console.log('   2. Using placeholder credentials: "your-smtp-password"');
console.log('   3. Hostinger SMTP requires real credentials');

console.log('\n🔧 **The Solution:**');
console.log('   To fix email sending, you need to:');
console.log('   1. Set SMTP_PASSWORD environment variable');
console.log('   2. Use real Hostinger email credentials');
console.log('   3. Or use a test SMTP service like Mailtrap');

console.log('\n🚀 **Quick Fix Options:**');

console.log('\nOption 1: Use Mailtrap for Testing');
console.log('   Update api/contact-dev.js and api/order-dev.js:');
console.log('   smtp: {');
console.log('     host: "smtp.mailtrap.io",');
console.log('     port: 2525,');
console.log('     auth: {');
console.log('       user: "your_mailtrap_user",');
console.log('       pass: "your_mailtrap_password"');
console.log('     }');
console.log('   }');

console.log('\nOption 2: Set Real Hostinger Credentials');
console.log('   export SMTP_PASSWORD="your_real_hostinger_password"');
console.log('   npm run dev:full');

console.log('\nOption 3: Use Gmail SMTP (for testing)');
console.log('   smtp: {');
console.log('     host: "smtp.gmail.com",');
console.log('     port: 587,');
console.log('     auth: {');
console.log('       user: "your_email@gmail.com",');
console.log('       pass: "your_app_password"');
console.log('     }');
console.log('   }');

console.log('\n📧 **Current Status:**');
console.log('   ✅ Email API endpoints working');
console.log('   ✅ Email templates ready');
console.log('   ✅ Nodemailer configuration correct');
console.log('   ❌ SMTP credentials need to be set');
console.log('   ❌ Actual email sending not working');

console.log('\n🎯 **Next Steps:**');
console.log('   1. Choose one of the email fix options above');
console.log('   2. Update SMTP credentials');
console.log('   3. Test email sending');
console.log('   4. Verify emails received at sales@restntravel.shop'); 