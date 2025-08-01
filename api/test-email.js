// Test email endpoint to diagnose SMTP issues
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

  try {
    console.log('Testing email configuration...');
    console.log('SMTP Config:', {
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      user: emailConfig.smtp.auth.user
    });

    const transporter = nodemailer.createTransport(emailConfig.smtp);
    
    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: `"RestNTravel Test" <${emailConfig.smtp.auth.user}>`,
      to: emailConfig.sales,
      subject: 'Test Email from RestNTravel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">✅ Email Test Successful!</h2>
          <p>This is a test email to verify that the SMTP configuration is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString('en-IN')}</p>
          <p><strong>From:</strong> ${emailConfig.smtp.auth.user}</p>
          <p><strong>To:</strong> ${emailConfig.sales}</p>
          <p><strong>SMTP Host:</strong> ${emailConfig.smtp.host}:${emailConfig.smtp.port}</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      config: {
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure,
        user: emailConfig.smtp.auth.user
      }
    });

  } catch (error) {
    console.error('Email test failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message,
      config: {
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure,
        user: emailConfig.smtp.auth.user
      }
    });
  }
} 