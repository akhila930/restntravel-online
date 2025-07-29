// Production Order API - MySQL + Email
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import { getEmailConfig } from '../config/production.js';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `REST${timestamp}${random}`;
};

// Send order email to sales team
const sendOrderEmail = async (orderData) => {
  const emailConfig = getEmailConfig();
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPinCode,
    totalAmount,
    items
  } = orderData;

  const orderHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
        🛍️ New Order Received - RestNTravel
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">📋 Order Details</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">👤 Customer Information</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
        <p><strong>Address:</strong> ${shippingAddress}, ${shippingCity}, ${shippingState} - ${shippingPinCode}</p>
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
            ${items.map(item => `
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

  const transporter = nodemailer.createTransport(emailConfig.smtp);

  const mailOptions = {
    from: `"RestNTravel Orders" <${emailConfig.smtp.auth.user}>`,
    to: emailConfig.sales,
    subject: `New Order #${orderNumber} - ₹${totalAmount}`,
    html: orderHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order email sent successfully for order #${orderNumber}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send order email:', error);
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { user, billingInfo, items, total } = req.body;

  if (!billingInfo || !items || !total) {
    return res.status(400).json({ success: false, message: 'Missing required order information' });
  }

  try {
    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Start database transaction
    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          user_id, order_number, customer_name, customer_email, customer_phone,
          shipping_address, shipping_city, shipping_state, shipping_pin_code, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user?.id || null,
          orderNumber,
          billingInfo.name,
          billingInfo.email,
          billingInfo.phone || null,
          billingInfo.street,
          billingInfo.city,
          billingInfo.state,
          billingInfo.pinCode,
          total
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (
            order_id, product_id, product_name, product_price, quantity, total_price
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.id,
            item.name,
            item.price,
            item.quantity,
            item.price * item.quantity
          ]
        );
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      // Prepare order data for email
      const orderData = {
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
      };

      // Send order email (don't wait for it to complete)
      sendOrderEmail(orderData).catch(error => {
        console.error('Email sending failed:', error);
      });

      return res.status(200).json({
        success: true,
        orderNumber,
        message: 'Order placed successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
} 