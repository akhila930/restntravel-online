// Development Admin API - Using actual product data and dynamic orders/users
import { getOrders, updateOrderStatus } from './order-dev.js';
import { getUsers } from './auth-dev.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import actual product data
const productsData = [
  { id: '1', name: '7 x 7" Jute/Cotton Cover Square Pillow', category: 'pillows', price: 100, image: 'IMG_3572.JPG', description: 'For Neck Rest. 150gms. Jute/Cotton Cover Square Pillow.', delivery_charges: 0 },
  { id: '2', name: '7 x 12" Jute/Cotton Cover Round Pillow', category: 'pillows', price: 200, image: 'neck round.png', description: 'For Neck Rest. 250gms. Jute/Cotton Cover Round Pillow.', delivery_charges: 0 },
  { id: '3', name: '10 x 10" Jute/Cotton Cover Square Pillow', category: 'pillows', price: 150, image: 'IMG_3577.JPG', description: 'For Back Rest & Seating. 300gms. Jute/Cotton Cover Square Pillow.', delivery_charges: 0 },
  { id: '4', name: '14 x 14" Jute/Cotton Cover Square Pillow', category: 'pillows', price: 200, image: 'IMG_5830.JPG', description: 'For Back Rest & Seating. 450gms. Jute/Cotton Cover Square Pillow.', delivery_charges: 0 },
  { id: '5', name: '20 x 26" Jute/Cotton Triangular Pillow', category: 'pillows', price: 300, image: 'triangle.png', description: 'For Back Rest & Seating. 750gms. Jute/Cotton Triangular Pillow.', delivery_charges: 0 },
  { id: '6', name: '14 x 22 " Jute/Cotton Cover Rectangular Pillow', category: 'pillows', price: 250, image: 'IMG_5823.JPG', description: 'For Sleeping. 750gms. Jute/Cotton Cover Rectangular Pillow.', delivery_charges: 0 },
  { id: '7', name: '16 x 22" Jute/Cotton Cover Rectangular Pillow', category: 'pillows', price: 300, image: 'IMG_5824.JPG', description: 'For Sleeping. 850gms. Jute/Cotton Cover Rectangular Pillow.', delivery_charges: 0 },
  { id: '8', name: '16 x 27" Jute/Cotton Cover Rectangular Pillow', category: 'pillows', price: 350, image: 'IMG_5826.JPG', description: 'For Sleeping. 1000gms. Jute/Cotton Cover Rectangular Pillow.', delivery_charges: 0 },
  { id: '9', name: 'Single Mattress 5\'x2.5\'', category: 'mattresses', price: 1500, image: 'IMG_5812.JPG', description: 'Single Mattress. 5\'x2.5\'.', delivery_charges: 0 },
  { id: '10', name: 'Double Mattress 6\'x5\'', category: 'mattresses', price: 2000, image: 'IMG_5817.JPG', description: 'Double Mattress. 6\'x5\'.', delivery_charges: 0 },
  { id: '11', name: 'Single Quilt 5\'x2.5\'', category: 'quilts', price: 1500, image: 'qui 1.png', description: 'Single Quilt. 5\'x2.5\'.', delivery_charges: 0 },
  { id: '12', name: 'Double Quilt 6\'x5\'', category: 'quilts', price: 2000, image: 'qui 2.png', description: 'Double Quilt. 6\'x5\'.', delivery_charges: 0 },
  { id: '13', name: 'Bean Bag 5\'x4\' (Patterned)', category: 'beanbags', price: 1500, image: 'IMG_5815.JPG', description: 'Bean Bag. 5\'x4\'. Patterned.', delivery_charges: 0 },
  { id: '14', name: 'Bean Bag 5\'x4\' (Plain)', category: 'beanbags', price: 1500, image: 'IMG_5815.JPG', description: 'Bean Bag. 5\'x4\'. Plain.', delivery_charges: 0 },
];

// Use actual product data from productsData.ts
let mockProducts = productsData.map(product => ({
  ...product,
  is_active: true,
  created_at: '2024-01-15T10:30:00Z'
}));

// Dynamic user data - will be populated from actual registrations
let mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@restntravel.shop',
    created_at: '2024-01-15T10:30:00Z'
  }
];

// Get dynamic users from auth API
const getDynamicUsers = () => {
  const authUsers = getUsers();
  // Combine admin user with registered users
  const allUsers = [...mockUsers];
  
  // Add registered users (excluding admin)
  authUsers.forEach(user => {
    if (user.email !== 'admin@restntravel.shop') {
      allUsers.push({
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        created_at: user.created_at
      });
    }
  });
  
  return allUsers;
};

// Get dynamic orders from order API
const getDynamicOrders = () => {
  return getOrders();
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      products: mockProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Add new product with image upload support
export const addProduct = async (req, res) => {
  const { name, category, price, image, description, is_active, delivery_charges, imageFile } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  try {
    let imageFilename = image;
    
    // Handle image upload if provided
    if (imageFile && imageFile.base64) {
      // In development, we'll save the base64 image to a file
      const timestamp = Date.now();
      imageFilename = `uploaded_${timestamp}.jpg`;
      
      // Save the base64 image to a file
      const productsDir = path.join(__dirname, '..', 'public', 'Products');
      const imagePath = path.join(productsDir, imageFilename);
      
      // Ensure the Products directory exists
      if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
      }
      
      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(imageFile.base64, 'base64');
      fs.writeFileSync(imagePath, imageBuffer);
      
      console.log('📸 Image saved:', imagePath);
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      category,
      price: parseFloat(price),
      image: imageFilename,
      description: description || '',
      is_active: is_active !== false,
      delivery_charges: parseFloat(delivery_charges) || 0,
      created_at: new Date().toISOString()
    };

    mockProducts.push(newProduct);

    return res.status(200).json({
      success: true,
      product: newProduct
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.query;
  const { name, category, price, image, description, is_active, delivery_charges, imageFile } = req.body;

  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let imageFilename = image;
    
    // Handle image upload if provided
    if (imageFile && imageFile.base64) {
      const timestamp = Date.now();
      imageFilename = `uploaded_${timestamp}.jpg`;
      
      // Save the base64 image to a file
      const productsDir = path.join(__dirname, '..', 'public', 'Products');
      const imagePath = path.join(productsDir, imageFilename);
      
      // Ensure the Products directory exists
      if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
      }
      
      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(imageFile.base64, 'base64');
      fs.writeFileSync(imagePath, imageBuffer);
      
      console.log('📸 Image saved for update:', imagePath);
    }

    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      name,
      category,
      price: parseFloat(price),
      image: imageFilename,
      description,
      is_active,
      delivery_charges: parseFloat(delivery_charges) || 0
    };

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.query;

  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    mockProducts.splice(productIndex, 1);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Get all orders (dynamic from order API)
export const getOrdersHandler = async (req, res) => {
  try {
    const orders = getDynamicOrders();
    return res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Update order status (connected to order API)
export const updateOrderStatusHandler = async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    // Update order status using the order API function
    updateOrderStatus(parseInt(id), status);

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    const allOrders = getDynamicOrders();
    const userOrders = allOrders.filter(order => order.user_id === parseInt(userId));
    
    return res.status(200).json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders'
    });
  }
};

// Get all users (dynamic from auth API)
export const getUsersHandler = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      users: getDynamicUsers()
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get dashboard stats (dynamic)
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = mockProducts.length;
    const orders = getDynamicOrders();
    const totalOrders = orders.length;
    const totalUsers = getDynamicUsers().length;
    const totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total_amount, 0);

    const recentOrders = orders.slice(0, 5);
    const recentUsers = getDynamicUsers().slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
};

// Main admin handler
export default async function handler(req, res) {
  const { action } = req.query;

  switch (action) {
    case 'products':
      if (req.method === 'GET') return getProducts(req, res);
      if (req.method === 'POST') return addProduct(req, res);
      if (req.method === 'PUT') return updateProduct(req, res);
      if (req.method === 'DELETE') return deleteProduct(req, res);
      break;
      
    case 'orders':
      if (req.method === 'GET') return getOrdersHandler(req, res);
      if (req.method === 'PUT') return updateOrderStatusHandler(req, res);
      break;
      
    case 'user-orders':
      if (req.method === 'GET') return getUserOrders(req, res);
      break;
      
    case 'users':
      if (req.method === 'GET') return getUsersHandler(req, res);
      break;
      
    case 'stats':
      if (req.method === 'GET') return getDashboardStats(req, res);
      break;
      
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
  }
} 