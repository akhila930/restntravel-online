// Admin routes
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    
    // Get total orders
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    
    // Get total revenue
    const [revenue] = await pool.execute('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
    
    // Get total products
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
    
    // Get total testimonials
    const [testimonialCount] = await pool.execute('SELECT COUNT(*) as count FROM testimonials');
    
    // Get recent orders
    const [recentOrders] = await pool.execute(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        totalUsers: userCount[0].count,
        totalOrders: orderCount[0].count,
        totalRevenue: revenue[0].total || 0,
        totalProducts: productCount[0].count,
        totalTestimonials: testimonialCount[0].count
      },
      recentOrders
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

// Get all users (admin)
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, name, email, role, phone, address, city, state, pin_code, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load users'
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(`
      SELECT id, name, email, role, phone, address, city, state, pin_code, created_at
      FROM users 
      WHERE id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load user'
    });
  }
});

// Update user (admin)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, city, state, pin_code } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    await pool.execute(`
      UPDATE users 
      SET name = ?, email = ?, role = ?, phone = ?, address = ?, 
          city = ?, state = ?, pin_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, email, role, phone, address, city, state, pin_code, id]);

    // Get updated user
    const [users] = await pool.execute(
      'SELECT id, name, email, role, phone, address, city, state, pin_code, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has orders
    const [orders] = await pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [id]
    );

    if (orders[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing orders'
      });
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

export default router; 