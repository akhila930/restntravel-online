# 🚀 Vercel Deployment Guide - RestNTravel

## 🎯 **Deployment Overview**

This guide will help you deploy your RestNTravel application to Vercel and connect your custom domain `restntravel.shop`.

## 📋 **Prerequisites**

1. ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. ✅ **Custom Domain** - `restntravel.shop` (already purchased)
3. ✅ **GitHub Account** - For code repository
4. ✅ **Hostinger Email** - `sales@restntravel.shop` for SMTP

## 🔧 **Step 1: Prepare Your Code for Production**

### **1.1 Create Production Configuration**

Create a `.env.production` file in your project root:

```bash
# Production Environment Variables
NODE_ENV=production
DOMAIN=restntravel.shop
PROTOCOL=https
SALES_EMAIL=sales@restntravel.shop
INFO_EMAIL=info@restntravel.shop
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=sales@restntravel.shop
SMTP_PASS=SalesRNT@8912
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **1.2 Update Vite Configuration**

Update `vite.config.ts` for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### **1.3 Create Vercel Configuration**

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "DOMAIN": "restntravel.shop",
    "PROTOCOL": "https",
    "SALES_EMAIL": "sales@restntravel.shop",
    "INFO_EMAIL": "info@restntravel.shop",
    "SMTP_HOST": "smtp.hostinger.com",
    "SMTP_PORT": "587",
    "SMTP_USER": "sales@restntravel.shop",
    "SMTP_PASS": "SalesRNT@8912"
  }
}
```

### **1.4 Update Package.json Scripts**

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "dev:full": "concurrently \"npm run dev\" \"node server.js\"",
    "vercel-build": "npm run build"
  }
}
```

## 🔄 **Step 2: Push Code to GitHub**

### **2.1 Initialize Git Repository**

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Create GitHub repository
# Go to github.com and create a new repository named "restntravel-online"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/restntravel-online.git
git branch -M main
git push -u origin main
```

## 🚀 **Step 3: Deploy to Vercel**

### **3.1 Connect to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in/Sign up** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository** (`restntravel-online`)

### **3.2 Configure Project Settings**

In Vercel project settings:

**Build Settings:**
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:**
Add these in Vercel dashboard:

```
NODE_ENV=production
DOMAIN=restntravel.shop
PROTOCOL=https
SALES_EMAIL=sales@restntravel.shop
INFO_EMAIL=info@restntravel.shop
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=sales@restntravel.shop
SMTP_PASS=SalesRNT@8912
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **3.3 Deploy**

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your app will be available at:** `https://your-project-name.vercel.app`

## 🌐 **Step 4: Connect Custom Domain**

### **4.1 Add Domain in Vercel**

1. **Go to your Vercel project dashboard**
2. **Click "Settings" → "Domains"**
3. **Add your domain:** `restntravel.shop`
4. **Click "Add"**

### **4.2 Configure DNS Records**

In your domain provider (where you bought `restntravel.shop`):

**Add these DNS records:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.19 |
| CNAME | www | cname.vercel-dns.com |

**Or if using CNAME:**
| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |

### **4.3 Verify Domain**

1. **Wait for DNS propagation** (can take up to 48 hours)
2. **Check domain status** in Vercel dashboard
3. **Domain should show as "Valid"**

## 🔧 **Step 5: Update Production API**

### **5.1 Create Production API Files**

Create `api/contact.js` (production version):

```javascript
// Production Contact Form API
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
          <h2 style="color: #16a34a;">📧 New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
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
```

### **5.2 Create Production Order API**

Create `api/order.js` (production version):

```javascript
// Production Order API
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
        <h2 style="color: #16a34a;">🛍️ New Order Received - RestNTravel</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${billingInfo.name}</p>
        <p><strong>Email:</strong> ${billingInfo.email}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${items.map(item => `<li>${item.name} - Qty: ${item.quantity} - ₹${item.price}</li>`).join('')}
        </ul>
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
```

## 🧪 **Step 6: Test Deployment**

### **6.1 Test Your Live Site**

1. **Visit:** `https://restntravel.shop`
2. **Test contact form**
3. **Test order placement**
4. **Check admin panel:** `https://restntravel.shop/admin`

### **6.2 Verify Email Functionality**

1. **Submit contact form** - Check `sales@restntravel.shop` inbox
2. **Place test order** - Check for order notifications
3. **Login to admin panel** with:
   - Email: `sales@restntravel.shop`
   - Password: `SalesRNT@8912`

## 🔒 **Step 7: Security & Optimization**

### **7.1 Update JWT Secret**

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update in Vercel environment variables.

### **7.2 Enable HTTPS**

Vercel automatically provides SSL certificates.

### **7.3 Set Up Monitoring**

1. **Enable Vercel Analytics**
2. **Set up error monitoring**
3. **Configure performance monitoring**

## 📋 **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain added to Vercel
- [ ] DNS records configured
- [ ] Production APIs created
- [ ] Email functionality tested
- [ ] Admin panel accessible
- [ ] SSL certificate active
- [ ] Performance optimized

## 🎯 **Final URLs**

- **Main Site:** `https://restntravel.shop`
- **Admin Panel:** `https://restntravel.shop/admin`
- **Contact:** `https://restntravel.shop/contact`
- **Shop:** `https://restntravel.shop/shop`

## 🚀 **Success!**

Your RestNTravel application is now live at `https://restntravel.shop` with:
- ✅ Custom domain connected
- ✅ Email functionality working
- ✅ Admin panel accessible
- ✅ SSL certificate active
- ✅ Professional deployment

---

**🎉 Your RestNTravel e-commerce site is now live and ready for customers!** 