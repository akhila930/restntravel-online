import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generatePaymentQR() {
  console.log('🔧 Generating Payment QR Code...\n');

  try {
    // UPI payment details
    const upiId = 'yespay.smessi13928@yesbankl';
    const merchantName = 'NATURETECH SIMPLEINV';
    const accountNumber = '0742';
    
    // Create UPI payment URL
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&tn=RestNTravel%20Payment&am=100&cu=INR`;
    
    console.log('1. UPI Payment Details:');
    console.log('   UPI ID:', upiId);
    console.log('   Merchant:', merchantName);
    console.log('   Account:', accountNumber);
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

    // Save QR code
    const qrCodePath = path.join(process.cwd(), 'public', 'payment-qr-code.png');
    fs.writeFileSync(qrCodePath, buffer);

    console.log('   ✅ QR Code generated successfully!');
    console.log('   📁 Saved to:', qrCodePath);
    console.log('   📏 Size:', buffer.length, 'bytes');

    // Also create a backup with a simpler name
    const backupPath = path.join(process.cwd(), 'public', 'qr-payment.png');
    fs.writeFileSync(backupPath, buffer);
    console.log('   📁 Backup saved to:', backupPath);

    console.log('\n🎉 Payment QR Code Generation Complete!');
    console.log('\n📝 QR Code contains:');
    console.log('   • UPI ID: yespay.smessi13928@yesbankl');
    console.log('   • Merchant: NATURETECH SIMPLEINV');
    console.log('   • Account: 0742');
    console.log('   • Currency: INR');
    console.log('\n🔄 Next steps:');
    console.log('1. Update cart page to use the new QR code');
    console.log('2. Test QR code scanning with UPI apps');

  } catch (error) {
    console.error('❌ Error generating QR code:', error.message);
  }
}

generatePaymentQR(); 