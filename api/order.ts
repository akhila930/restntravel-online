import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { user, billingInfo, items, total } = req.body;

  // Configure nodemailer (replace with your SMTP credentials)
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // e.g., smtp.gmail.com
    port: 587,
    secure: false,
    auth: {
      user: 'your@email.com',
      pass: 'yourpassword',
    },
  });

  const orderHtml = `
    <h2>New Order Received</h2>
    <h3>Customer Info</h3>
    <ul>
      <li>Name: ${billingInfo.name}</li>
      <li>Email: ${billingInfo.email}</li>
      <li>Phone: ${billingInfo.phone}</li>
      <li>Address: ${billingInfo.street}, ${billingInfo.city}, ${billingInfo.state}, ${billingInfo.pinCode}</li>
    </ul>
    <h3>Order Items</h3>
    <ul>
      ${items.map((item: any) => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
    </ul>
    <p><strong>Total:</strong> ₹${total}</p>
  `;

  try {
    await transporter.sendMail({
      from: 'orders@naturetechsimpleinventions.com',
      to: 'info@naturetechsimpleinventions.com',
      subject: 'New Order from RestNTravel',
      html: orderHtml,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Order email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send order email' });
  }
} 