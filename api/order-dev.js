// Development Order API - Dynamic order storage
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent order storage file
const ordersFile = path.join(__dirname, '..', 'data', 'orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load orders from file or initialize empty array
const loadOrders = () => {
  try {
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
  return [];
};

// Save orders to file
const saveOrders = (orders) => {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Initialize orders array
let mockOrders = loadOrders();

// Email configuration
const emailConfig = {
  sales: 'sales@restntravel.shop',
  smtp: {
    host: 'smtp.hostinger.com', // Hostinger SMTP
    port: 587,
    secure: false,
    auth: {
      user: 'sales@restntravel.shop',
      pass: 'SalesRNT@8912'
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

// Send confirmation email to customer
const sendCustomerConfirmationEmail = async (orderData) => {
  const {
    orderNumber,
    customerName,
    customerEmail,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPinCode,
    totalAmount,
    items
  } = orderData;

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
        🎉 Order Confirmed - RestNTravel
      </h2>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="color: #374151; margin-top: 0;">✅ Thank you for your order!</h3>
        <p>Dear ${customerName},</p>
        <p>We have received your order and it is being processed. You will receive a confirmation call within 24 hours.</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">📋 Order Details</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Pending Confirmation</span></p>
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

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">📍 Delivery Address</h3>
        <p>${shippingAddress}</p>
        <p>${shippingCity}, ${shippingState} - ${shippingPinCode}</p>
      </div>

      <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0;">📞 What's Next?</h3>
        <p>• You will receive a confirmation call within 24 hours</p>
        <p>• Delivery time: 3-7 business days</p>
        <p>• Track your order status on our website</p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>Thank you for choosing RestNTravel!</p>
        <p>For any queries, contact us at sales@restntravel.shop</p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport(emailConfig.smtp);

  const mailOptions = {
    from: `"RestNTravel" <${emailConfig.smtp.auth.user}>`,
    to: customerEmail,
    subject: `Order Confirmation #${orderNumber} - RestNTravel`,
    html: confirmationHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Customer confirmation email sent successfully for order #${orderNumber}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send customer confirmation email:', error);
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

    // Create order object
    const newOrder = {
      id: mockOrders.length + 1,
      order_number: orderNumber,
      customer_name: billingInfo.name,
      customer_email: billingInfo.email,
      customer_phone: billingInfo.phone || null,
      total_amount: total,
      status: 'pending',
      created_at: new Date().toISOString(),
      items_summary: items.map(item => `${item.name} (${item.quantity})`).join(', '),
      user_id: user?.id || null,
      shipping_address: billingInfo.street,
      shipping_city: billingInfo.city,
      shipping_state: billingInfo.state,
      shipping_pin_code: billingInfo.pinCode
    };

    // Store order in memory
    mockOrders.push(newOrder);
    saveOrders(mockOrders); // Save to file

    // Log order details (for development)
    console.log('📦 New Order Received (Development):', {
      orderNumber,
      customerName: billingInfo.name,
      customerEmail: billingInfo.email,
      totalAmount: total,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });

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

    // Send confirmation email to customer (don't wait for it to complete)
    sendCustomerConfirmationEmail({
      orderNumber,
      customerName: billingInfo.name,
      customerEmail: billingInfo.email,
      shippingAddress: billingInfo.street,
      shippingCity: billingInfo.city,
      shippingState: billingInfo.state,
      shippingPinCode: billingInfo.pinCode,
      totalAmount: total,
      items
    }).catch(error => {
      console.error('Customer confirmation email sending failed:', error);
    });

    return res.status(200).json({
      success: true,
      orderNumber,
      message: 'Order placed successfully (Development Mode)'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
}

// Export orders for admin panel
export const getOrders = () => mockOrders;
export const updateOrderStatus = (orderId, status) => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    order.updated_at = new Date().toISOString();
    saveOrders(mockOrders); // Save updated orders to file
  }
}; 