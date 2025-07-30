// Production Contact Form API
import nodemailer from 'nodemailer';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and message are required' 
    });
  }

  try {
    const transporter = nodemailer.createTransport(emailConfig.smtp);
    
    const mailOptions = {
      from: `"RestNTravel Contact" <${emailConfig.smtp.auth.user}>`,
      to: emailConfig.sales,
      subject: `Contact Form: ${subject || 'General Inquiry'} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            📧 New Contact Form Submission - RestNTravel
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">💬 Message</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #16a34a;">
              <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0;">📞 Next Steps</h3>
            <p>1. Review the customer inquiry</p>
            <p>2. Respond to the customer within 24 hours</p>
            <p>3. Follow up if needed</p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>This email was sent automatically from RestNTravel Contact Form</p>
            <p>Domain: restntravel.shop</p>
          </div>
        </div>
      `,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
} 