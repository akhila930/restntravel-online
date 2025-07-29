import fs from 'fs';
import path from 'path';

console.log('🔍 Testing QR Code Image Access...\n');

const qrCodePath = path.join(process.cwd(), 'public', 'NatureTech SimpleInventions Pvt Ltd  (Only Logo).png');

console.log('1. Checking file existence...');
console.log('   File path:', qrCodePath);
console.log('   File exists:', fs.existsSync(qrCodePath));

if (fs.existsSync(qrCodePath)) {
  const stats = fs.statSync(qrCodePath);
  console.log('   File size:', stats.size, 'bytes');
  console.log('   File permissions:', stats.mode.toString(8));
  
  console.log('\n2. Testing file readability...');
  try {
    const buffer = fs.readFileSync(qrCodePath);
    console.log('   File readable: ✅');
    console.log('   Buffer size:', buffer.length, 'bytes');
    console.log('   First 10 bytes:', buffer.slice(0, 10));
  } catch (error) {
    console.log('   File readable: ❌', error.message);
  }
} else {
  console.log('   ❌ File not found!');
  
  console.log('\n3. Checking public directory...');
  const publicDir = path.join(process.cwd(), 'public');
  console.log('   Public directory exists:', fs.existsSync(publicDir));
  
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    console.log('   Files in public directory:');
    files.forEach(file => {
      if (file.toLowerCase().includes('nature') || file.toLowerCase().includes('qr')) {
        console.log('     📁', file);
      }
    });
  }
}

console.log('\n🎯 QR Code Test Complete!'); 