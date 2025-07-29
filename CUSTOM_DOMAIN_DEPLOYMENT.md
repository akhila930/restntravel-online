# Custom Domain Deployment Guide for RestNTravel

## 🎯 **Overview**

This guide will help you deploy your RestNTravel application with a custom domain from Hostinger and configure your new email addresses.

---

## 🌐 **Step 1: Domain Purchase & Setup**

### **1.1 Buy Domain from Hostinger**
1. **Go to Hostinger** and purchase your domain (e.g., `restntravel.com`)
2. **Choose a domain name** that represents your brand
3. **Complete the purchase** and wait for domain activation

### **1.2 Domain Configuration**
1. **Access Hostinger Control Panel**
2. **Go to Domains → Manage**
3. **Note down your domain name** for configuration

---

## 📧 **Step 2: Email Setup**

### **2.1 Create Email Accounts**
1. **In Hostinger Control Panel**, go to **Email → Email Accounts**
2. **Create these email accounts**:
   - `sales@yourdomain.com` (for order notifications)
   - `info@yourdomain.com` (for general inquiries)
   - `admin@yourdomain.com` (for admin access)

### **2.2 Email Configuration**
Update your `.env` file with the new email settings:

```env
# Domain Configuration
DOMAIN=yourdomain.com
PROTOCOL=https

# Email Configuration
SALES_EMAIL=sales@yourdomain.com
INFO_EMAIL=info@yourdomain.com

# SMTP Configuration (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=sales@yourdomain.com
SMTP_PASS=your-email-password

# Database Configuration (Hostinger)
DB_HOST=localhost
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_NAME=your_hostinger_db_name
DB_PORT=3306

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## 🚀 **Step 3: Vercel Deployment**

### **3.1 Prepare for Deployment**
1. **Update configuration files**:
   ```bash
   # Update config/production.js with your domain
   # Update all email references in the code
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

### **3.2 Deploy to Vercel**
1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - Go to **Settings → Environment Variables**
   - Add all variables from your `.env` file

3. **Deploy the application**:
   ```bash
   vercel --prod
   ```

### **3.3 Configure Custom Domain**
1. **In Vercel Dashboard**:
   - Go to **Settings → Domains**
   - Add your custom domain: `yourdomain.com`
   - Add `www.yourdomain.com` (optional)

2. **Update DNS Records**:
   - Go to **Hostinger DNS Management**
   - Add these records:
     ```
     Type: A
     Name: @
     Value: 76.76.19.19
     
     Type: CNAME
     Name: www
     Value: yourdomain.com
     ```

---

## 🗄️ **Step 4: Database Setup**

### **4.1 Hostinger MySQL Database**
1. **Create MySQL Database** in Hostinger:
   - Go to **Databases → MySQL Databases**
   - Create a new database
   - Note down database credentials

2. **Import Database Schema**:
   ```sql
   -- Run the database_schema.sql file in phpMyAdmin
   -- This will create all necessary tables
   ```

3. **Update Database Configuration**:
   - Update `config/database.js` with your Hostinger credentials
   - Test the connection

---

## 🔧 **Step 5: Code Updates**

### **5.1 Update Email References**
Replace all hardcoded email addresses:

```javascript
// Before
const salesEmail = 'sales@restNtravel.com';

// After
const salesEmail = 'sales@yourdomain.com';
```

### **5.2 Update Domain References**
Replace all hardcoded domain references:

```javascript
// Before
const baseUrl = 'https://restntravel.com';

// After
const baseUrl = 'https://yourdomain.com';
```

### **5.3 Update Configuration Files**
1. **Update `config/production.js`**:
   ```javascript
   domain: {
     primary: 'yourdomain.com',
     protocol: 'https',
     fullUrl: 'https://yourdomain.com',
   },
   email: {
     sales: 'sales@yourdomain.com',
     info: 'info@yourdomain.com',
   }
   ```

2. **Update `vercel.json`** (if needed):
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## 📱 **Step 6: Testing**

### **6.1 Test Your Domain**
1. **Visit your domain**: `https://yourdomain.com`
2. **Test all functionality**:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Order placement
   - Admin panel access

### **6.2 Test Email Functionality**
1. **Place a test order**
2. **Check if email is sent** to `sales@yourdomain.com`
3. **Verify email content** and formatting

### **6.3 Test Admin Panel**
1. **Access admin panel**: `https://yourdomain.com/admin`
2. **Test all admin functions**:
   - Product management
   - Order management
   - User management

---

## 🔒 **Step 7: Security & SSL**

### **7.1 SSL Certificate**
1. **Vercel automatically provides SSL** for custom domains
2. **Verify SSL is working**: `https://yourdomain.com`

### **7.2 Security Headers**
Add security headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📊 **Step 8: Monitoring & Analytics**

### **8.1 Google Analytics**
1. **Set up Google Analytics** for your domain
2. **Track user behavior** and sales

### **8.2 Vercel Analytics**
1. **Enable Vercel Analytics** in dashboard
2. **Monitor performance** and errors

### **8.3 Email Monitoring**
1. **Monitor email delivery** rates
2. **Check spam folder** for order emails

---

## 🛠️ **Step 9: Maintenance**

### **9.1 Regular Backups**
```bash
# Database backup script
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

### **9.2 Updates**
1. **Keep dependencies updated**
2. **Monitor for security updates**
3. **Test after updates**

### **9.3 Performance Monitoring**
1. **Monitor page load times**
2. **Check database performance**
3. **Optimize images and assets**

---

## 🎯 **Quick Checklist**

- [ ] **Domain purchased** from Hostinger
- [ ] **Email accounts created** (sales@, info@, admin@)
- [ ] **Environment variables** configured
- [ ] **Database created** and schema imported
- [ ] **Code updated** with new domain/email
- [ ] **Deployed to Vercel** with custom domain
- [ ] **DNS records** configured
- [ ] **SSL certificate** working
- [ ] **All functionality tested**
- [ ] **Email notifications working**
- [ ] **Admin panel accessible**
- [ ] **Analytics configured**
- [ ] **Backup system in place**

---

## 📞 **Support**

### **If you encounter issues:**

1. **Check Vercel logs** for deployment errors
2. **Verify DNS settings** in Hostinger
3. **Test database connection**
4. **Check email configuration**
5. **Review environment variables**

### **Common Issues:**

- **Domain not resolving**: Check DNS records
- **Email not sending**: Verify SMTP credentials
- **Database connection failed**: Check Hostinger database settings
- **Admin panel not working**: Verify JWT secret and user roles

Your RestNTravel application is now ready for production with your custom domain! 🚀 