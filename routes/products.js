// Products routes
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all active products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load products'
    });
  }
});

// Get all products (admin)
router.get('/admin', async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: products[0]
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load product'
    });
  }
});

// Add new product (admin)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      image,
      description,
      delivery_charges = 0
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO products (name, category, price, image, description, delivery_charges)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, category, price, image, description, delivery_charges]);

    const productId = result.insertId;

    // Get the created product
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: products[0]
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
});

// Update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      image,
      description,
      is_active,
      delivery_charges
    } = req.body;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    await pool.execute(`
      UPDATE products 
      SET name = ?, category = ?, price = ?, image = ?, description = ?, 
          is_active = ?, delivery_charges = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, category, price, image, description, is_active, delivery_charges, id]);

    // Get updated product
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: products[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

export default router; 