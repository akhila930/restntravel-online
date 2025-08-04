// Orders routes
import express from 'express';
import nodemailer from 'nodemailer';
import pool from '../config/database.js';

const router = express.Router();

// Email configuration
const emailConfig = {
  sales: process.env.SALES_EMAIL || 'sales@restntravel.shop',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'sales@restntravel.shop',
      pass: process.env.SMTP_PASS || 'SalesRNT@8912'
    }
  }
};

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `REST${timestamp}${random}`;
};

// Send order email to sales team
const sendOrderEmail = async (orderData) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig.smtp);
    
    const orderHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
          🛍️ New Order Received - RestNTravel
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 Order Details</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">👤 Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone || 'Not provided'}</p>
          <p><strong>Address:</strong> ${orderData.shippingAddress}, ${orderData.shippingCity}, ${orderData.shippingState} - ${orderData.shippingPinCode}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📦 Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #16a34a; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${item.price}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin-top: 0;">🚚 Next Steps</h3>
          <p>1. Confirm the order with the customer</p>
          <p>2. Process the order for delivery</p>
          <p>3. Update order status in the system</p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>This email was sent automatically from RestNTravel Order Management System</p>
          <p>Domain: restntravel.shop</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"RestNTravel Orders" <${emailConfig.smtp.auth.user}>`,
      to: emailConfig.sales,
      subject: `New Order #${orderData.orderNumber} - ₹${orderData.totalAmount}`,
      html: orderHtml
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order email sent successfully for order #${orderData.orderNumber}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send order email:', error);
    return false;
  }
};

// Create new order
router.post('/', async (req, res) => {
  try {
    const { user, billingInfo, items, total, paymentMethod } = req.body;

    if (!billingInfo || !items || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    const orderNumber = generateOrderNumber();

    // Insert order into database
    const [result] = await pool.execute(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        total_amount, shipping_address, shipping_city, shipping_state, 
        shipping_pin_code, payment_method, items_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber,
      user?.id || null,
      billingInfo.name,
      billingInfo.email,
      billingInfo.phone,
      total,
      billingInfo.street,
      billingInfo.city,
      billingInfo.state,
      billingInfo.pinCode,
      paymentMethod,
      items.map(item => `${item.name} (${item.quantity})`).join(', ')
    ]);

    const orderId = result.insertId;

    // Send order email (don't wait for it to complete)
    sendOrderEmail({
      orderNumber,
      customerName: billingInfo.name,
      customerEmail: billingInfo.email,
      customerPhone: billingInfo.phone,
      shippingAddress: billingInfo.street,
      shippingCity: billingInfo.city,
      shippingState: billingInfo.state,
      shippingPinCode: billingInfo.pinCode,
      totalAmount: total,
      items
    }).catch(error => {
      console.error('Email sending failed:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderNumber,
      orderId
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
});

// Get all orders (admin)
router.get('/admin', async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load orders'
    });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load orders'
    });
  }
});

// Update order status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    await pool.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

export default router; 