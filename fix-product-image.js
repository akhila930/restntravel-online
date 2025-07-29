import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function fixProductImage() {
  console.log('🔧 Fixing Product Image...\n');

  try {
    // Update product 1 to use the original image
    const updateData = {
      name: '7 x 7" Jute/Cotton Cover Square Pillow',
      category: 'pillows',
      price: 100,
      image: 'IMG_3572.JPG',
      description: 'For Neck Rest. 150gms. Jute/Cotton Cover Square Pillow.',
      is_active: true
    };

    const response = await fetch(`${API_BASE}/admin?action=products&id=1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    console.log('Update result:', result.success ? 'SUCCESS' : 'FAILED');
    
    if (result.success) {
      console.log('✅ Product image fixed!');
      console.log('✅ Now using: IMG_3572.JPG');
      console.log('\n🔄 Please refresh your browser to see the changes:');
      console.log('   - Admin panel: http://localhost:8080/admin');
      console.log('   - Shop page: http://localhost:8080/shop');
    } else {
      console.log('❌ Failed to update product:', result.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixProductImage(); 