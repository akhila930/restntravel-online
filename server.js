import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import development API handlers
import authHandler from './api/auth-dev.js';
import orderHandler from './api/order-dev.js';
import adminHandler from './api/admin-dev.js';
import qrCodeHandler from './api/qr-code-dev.js';
import testimonialsHandler from './api/testimonials-dev.js';
import contactHandler from './api/contact-dev.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware with increased body size limits for image uploads
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Increased from default ~100kb to 20MB
app.use(express.urlencoded({ limit: '20mb', extended: true })); // For form data
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/auth', async (req, res) => {
  try {
    await authHandler(req, res);
  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/order', async (req, res) => {
  try {
    await orderHandler(req, res);
  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin API Routes
app.get('/api/admin', async (req, res) => {
  try {
    await adminHandler(req, res);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/admin', async (req, res) => {
  try {
    await adminHandler(req, res);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/admin', async (req, res) => {
  try {
    await adminHandler(req, res);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/admin', async (req, res) => {
  try {
    await adminHandler(req, res);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// QR Code Management API Routes
app.get('/api/qr-code', async (req, res) => {
  try {
    await qrCodeHandler(req, res);
  } catch (error) {
    console.error('QR Code API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/qr-code', async (req, res) => {
  try {
    await qrCodeHandler(req, res);
  } catch (error) {
    console.error('QR Code API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Testimonials API Routes
app.get('/api/testimonials', async (req, res) => {
  try {
    await testimonialsHandler(req, res);
  } catch (error) {
    console.error('Testimonials API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    await testimonialsHandler(req, res);
  } catch (error) {
    console.error('Testimonials API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Contact API Routes
app.post('/api/contact', async (req, res) => {
  try {
    await contactHandler(req, res);
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📧 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔧 Admin panel available at http://localhost:${PORT}/admin`);
  console.log(`🔧 Using development mode (no database required)`);
}); 