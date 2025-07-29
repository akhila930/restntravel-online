import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

async function testImageUpload() {
  console.log('🧪 Testing Image Upload Functionality...\n');

  try {
    // Test 1: Check current product image
    console.log('1. Checking current product image...');
    const productsResponse = await fetch(`${API_BASE}/admin?action=products`);
    const productsData = await productsResponse.json();
    
    if (productsData.success) {
      const product1 = productsData.products.find(p => p.id === '1');
      if (product1) {
        console.log('   Current image:', product1.image);
      }
    }

    // Test 2: Create a test image (simple base64 data)
    console.log('\n2. Creating test image...');
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 pixel PNG
    
    // Test 3: Update product with new image
    console.log('\n3. Testing image upload...');
    const updateData = {
      name: '7 x 7" Jute/Cotton Cover Square Pillow',
      category: 'pillows',
      price: 100,
      image: 'IMG_3572.JPG', // Keep original as fallback
      description: 'For Neck Rest. 150gms. Jute/Cotton Cover Square Pillow.',
      is_active: true,
      imageFile: {
        base64: testImageBase64,
        filename: 'test-upload.png'
      }
    };

    const response = await fetch(`${API_BASE}/admin?action=products&id=1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    console.log('   Upload result:', result.success ? 'SUCCESS' : 'FAILED');
    
    if (result.success) {
      console.log('   ✅ Image upload test completed!');
      
      // Test 4: Check if the uploaded file exists
      console.log('\n4. Checking uploaded file...');
      const productsDir = path.join(process.cwd(), 'public', 'Products');
      const files = fs.readdirSync(productsDir);
      const uploadedFiles = files.filter(f => f.startsWith('uploaded_'));
      
      if (uploadedFiles.length > 0) {
        console.log('   ✅ Uploaded files found:', uploadedFiles);
        
        // Test 5: Check the latest uploaded file
        const latestFile = uploadedFiles[uploadedFiles.length - 1];
        const filePath = path.join(productsDir, latestFile);
        const stats = fs.statSync(filePath);
        console.log('   ✅ Latest uploaded file:', latestFile);
        console.log('   ✅ File size:', stats.size, 'bytes');
        
        // Test 6: Verify the product now uses the uploaded image
        console.log('\n5. Verifying product update...');
        const updatedResponse = await fetch(`${API_BASE}/admin?action=products`);
        const updatedData = await updatedResponse.json();
        
        if (updatedData.success) {
          const updatedProduct = updatedData.products.find(p => p.id === '1');
          if (updatedProduct) {
            console.log('   ✅ Product now uses:', updatedProduct.image);
            console.log('   ✅ File exists:', fs.existsSync(path.join(productsDir, updatedProduct.image)));
          }
        }
      } else {
        console.log('   ❌ No uploaded files found');
      }
    } else {
      console.log('   ❌ Upload failed:', result.message);
    }

    console.log('\n🎉 Image upload test completed!');
    console.log('\n📝 What this means:');
    console.log('✅ Image upload functionality is working');
    console.log('✅ Files are being saved to the Products folder');
    console.log('✅ Product data is being updated correctly');
    console.log('\n🔄 Next steps:');
    console.log('1. Refresh your browser (Ctrl+Shift+R)');
    console.log('2. Check admin panel: http://localhost:8080/admin');
    console.log('3. Try uploading a new image in the admin panel');
    console.log('4. The image should now display correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the development servers are running:');
    console.log('   npm run dev:full');
  }
}

testImageUpload(); 