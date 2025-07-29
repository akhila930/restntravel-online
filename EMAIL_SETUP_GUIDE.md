# 📧 Email Setup Guide - RestNTravel

## 🔍 **Current Issue Identified**

**Problem:** Emails are not being sent to `sales@restntravel.shop` because SMTP credentials are not configured.

**Root Cause:** 
- SMTP_PASSWORD environment variable is not set
- Using placeholder credentials: "your-smtp-password"
- Hostinger SMTP requires real credentials

## 🚀 **Quick Fix Options**

### **Option 1: Use Mailtrap for Testing (Recommended for Development)**

**Step 1:** Sign up for free Mailtrap account
- Go to [mailtrap.io](https://mailtrap.io)
- Create free account
- Get your SMTP credentials

**Step 2:** Update credentials in the code
```javascript
// In api/contact-dev.js and api/order-dev.js
smtp: {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'your_mailtrap_user', // Replace with your actual Mailtrap user
    pass: 'your_mailtrap_password' // Replace with your actual Mailtrap password
  }
}
```

**Step 3:** Test email sending
- Submit contact form
- Place test order
- Check Mailtrap inbox for emails

### **Option 2: Use Real Hostinger SMTP (For Production)**

**Step 1:** Get Hostinger email credentials
- Login to Hostinger control panel
- Go to Email section
- Get SMTP settings for `sales@restntravel.shop`

**Step 2:** Set environment variable
```bash
export SMTP_PASSWORD="your_real_hostinger_password"
npm run dev:full
```

**Step 3:** Update code to use Hostinger SMTP
```javascript
smtp: {
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sales@restntravel.shop',
    pass: process.env.SMTP_PASSWORD
  }
}
```

### **Option 3: Use Gmail SMTP (For Testing)**

**Step 1:** Enable 2-factor authentication on Gmail
**Step 2:** Generate App Password
**Step 3:** Update credentials
```javascript
smtp: {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
}
```

## 📧 **Email Types Configured**

### **1. Contact Form Emails**
- **To:** `sales@restntravel.shop`
- **From:** `sales@restntravel.shop`
- **Reply-To:** Customer's email
- **Template:** Professional HTML with customer details

### **2. Order Notification Emails**
- **To:** `sales@restntravel.shop`
- **From:** `sales@restntravel.shop`
- **Template:** Detailed order information with items and customer details

### **3. Customer Confirmation Emails**
- **To:** Customer's email
- **From:** `sales@restntravel.shop`
- **Template:** Order confirmation with tracking information

## 🔧 **Current Configuration Status**

| Component | Status | Details |
|-----------|--------|---------|
| Email API Endpoints | ✅ Working | Contact and Order APIs functional |
| Email Templates | ✅ Ready | Professional HTML templates |
| Nodemailer Setup | ✅ Fixed | createTransport function working |
| SMTP Configuration | ⚠️ Needs Credentials | Using placeholder credentials |
| Actual Email Sending | ❌ Not Working | Due to missing SMTP credentials |

## 🧪 **Testing Instructions**

### **For Development (Mailtrap):**
1. Update Mailtrap credentials in `api/contact-dev.js` and `api/order-dev.js`
2. Start server: `npm run dev:full`
3. Submit contact form at `/contact`
4. Place test order at `/cart`
5. Check Mailtrap inbox for emails

### **For Production (Hostinger):**
1. Set `SMTP_PASSWORD` environment variable
2. Update SMTP settings to use Hostinger
3. Test with real orders and contact forms
4. Verify emails received at `sales@restntravel.shop`

## 📋 **Files to Update**

| File | Purpose | SMTP Settings |
|------|---------|---------------|
| `api/contact-dev.js` | Contact form emails | Update auth.user and auth.pass |
| `api/order-dev.js` | Order notification emails | Update auth.user and auth.pass |
| `api/order.js` | Production order emails | Uses environment variables |

## ⚠️ **Important Notes**

1. **For Development:** Use Mailtrap to avoid sending test emails to real addresses
2. **For Production:** Use Hostinger SMTP with real credentials
3. **Security:** Never commit real SMTP passwords to version control
4. **Testing:** Always test email functionality before deployment

## 🎯 **Next Steps**

1. **Choose an email provider** (Mailtrap for testing, Hostinger for production)
2. **Update SMTP credentials** in the appropriate files
3. **Test email sending** with contact forms and orders
4. **Verify emails received** at the target addresses
5. **Deploy with working email functionality**

---

**📧 Email functionality is ready - just needs SMTP credentials!** 