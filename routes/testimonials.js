// Testimonials routes
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all active testimonials
router.get('/', async (req, res) => {
  try {
    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      testimonials
    });

  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load testimonials'
    });
  }
});

// Get all testimonials (admin)
router.get('/admin', async (req, res) => {
  try {
    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      testimonials
    });

  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load testimonials'
    });
  }
});

// Add new testimonial (admin)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      rating,
      comment,
      image,
      video,
      product,
      is_active = true
    } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and comment are required'
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO testimonials (name, rating, comment, image, video, product, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, rating, comment, image, video, product, is_active]);

    const testimonialId = result.insertId;

    // Get the created testimonial
    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [testimonialId]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      testimonial: testimonials[0]
    });

  } catch (error) {
    console.error('Add testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add testimonial'
    });
  }
});

// Update testimonial (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      rating,
      comment,
      image,
      video,
      product,
      is_active
    } = req.body;

    // Check if testimonial exists
    const [existingTestimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (existingTestimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Update testimonial
    await pool.execute(`
      UPDATE testimonials 
      SET name = ?, rating = ?, comment = ?, image = ?, video = ?, 
          product = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, rating, comment, image, video, product, is_active, id]);

    // Get updated testimonial
    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: testimonials[0]
    });

  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
    });
  }
});

// Delete testimonial (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const [existingTestimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (existingTestimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete testimonial
    await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
});

export default router; 