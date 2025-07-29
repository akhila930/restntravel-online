import { pool } from '../config/database.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  const { name, category, price, image, description, is_active } = req.body;

  if (!name || !category || !price || !image) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO products (name, category, price, image, description, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, price, image, description || '', is_active !== false]
    );

    return res.status(200).json({
      success: true,
      product: {
        id: result.insertId,
        name,
        category,
        price,
        image,
        description,
        is_active: is_active !== false
      }
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
  const { id } = req.params;
  const { name, category, price, image, description, is_active } = req.body;

  try {
    await pool.execute(
      'UPDATE products SET name = ?, category = ?, price = ?, image = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, category, price, image, description, is_active, id]
    );

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
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    
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

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, 
             GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    await pool.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

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

// Get all users
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get total products
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
    
    // Get total orders
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    
    // Get total users
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Get total revenue
    const [revenue] = await pool.execute('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
    
    // Get recent orders
    const [recentOrders] = await pool.execute(`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    // Get recent users
    const [recentUsers] = await pool.execute(`
      SELECT id, name, email, created_at FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts: productCount[0].count,
        totalOrders: orderCount[0].count,
        totalUsers: userCount[0].count,
        totalRevenue: revenue[0].total || 0,
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
      break;
      
    case 'orders':
      if (req.method === 'GET') return getOrders(req, res);
      break;
      
    case 'users':
      if (req.method === 'GET') return getUsers(req, res);
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