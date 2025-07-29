import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateDynamicQR(amount = 100) {
  console.log(`🔧 Generating Dynamic QR Code for ₹${amount}...\n`);

  try {
    // UPI payment details
    const upiId = 'yespay.smessi13928@yesbankl';
    const merchantName = 'NATURETECH SIMPLEINV';
    const accountNumber = '0742';
    
    // Create UPI payment URL with dynamic amount
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&tn=RestNTravel%20Payment&am=${amount}&cu=INR`;
    
    console.log('1. UPI Payment Details:');
    console.log('   UPI ID:', upiId);
    console.log('   Merchant:', merchantName);
    console.log('   Account:', accountNumber);
    console.log('   Amount:', `₹${amount}`);
    console.log('   Payment URL:', upiPaymentUrl);

    // Generate QR code
    console.log('\n2. Generating QR Code...');
    const qrCodeDataURL = await QRCode.toDataURL(upiPaymentUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Convert data URL to buffer
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save QR code with amount in filename
    const qrCodePath = path.join(process.cwd(), 'public', `payment-qr-${amount}.png`);
    fs.writeFileSync(qrCodePath, buffer);

    console.log('   ✅ QR Code generated successfully!');
    console.log('   📁 Saved to:', qrCodePath);
    console.log('   📏 Size:', buffer.length, 'bytes');

    // Also create a generic one
    const genericPath = path.join(process.cwd(), 'public', 'payment-qr-dynamic.png');
    fs.writeFileSync(genericPath, buffer);
    console.log('   📁 Generic saved to:', genericPath);

    console.log('\n🎉 Dynamic QR Code Generation Complete!');
    console.log('\n📝 QR Code contains:');
    console.log(`   • Amount: ₹${amount}`);
    console.log('   • UPI ID: yespay.smessi13928@yesbankl');
    console.log('   • Merchant: NATURETECH SIMPLEINV');
    console.log('   • Account: 0742');
    console.log('   • Currency: INR');

  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

// Generate QR codes for common amounts
async function generateCommonAmounts() {
  const amounts = [100, 200, 500, 1000, 1500, 2000];
  
  console.log('🔧 Generating QR Codes for Common Amounts...\n');
  
  for (const amount of amounts) {
    await generateDynamicQR(amount);
    console.log('---');
  }
}

// If run directly, generate common amounts
if (process.argv[2]) {
  const amount = parseInt(process.argv[2]);
  generateDynamicQR(amount);
} else {
  generateCommonAmounts();
} 