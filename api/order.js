// Vercel API function for orders
import nodemailer from 'nodemailer';

const emailConfig = {
  sales: process.env.SALES_EMAIL || 'sales@restntravel.shop',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'sales@restntravel.shop',
      pass: process.env.SMTP_PASS || 'SalesRNT@8912'
    }
  }
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `REST${timestamp}${random}`;
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
    const orderNumber = generateOrderNumber();

    // Send order email
    const transporter = nodemailer.createTransport(emailConfig.smtp);
    
    const orderHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
          🛍️ New Order Received - RestNTravel
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${total}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">👤 Customer Information</h3>
          <p><strong>Name:</strong> ${billingInfo.name}</p>
          <p><strong>Email:</strong> ${billingInfo.email}</p>
          <p><strong>Phone:</strong> ${billingInfo.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> ${billingInfo.street}, ${billingInfo.city}, ${billingInfo.state} - ${billingInfo.pinCode}</p>
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

    const mailOptions = {
      from: `"RestNTravel Orders" <${emailConfig.smtp.auth.user}>`,
      to: emailConfig.sales,
      subject: `New Order #${orderNumber} - ₹${total}`,
      html: orderHtml
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      orderNumber,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
} 