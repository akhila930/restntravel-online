# 🚀 Hostinger Deployment Guide - RestNTravel

## 🎯 **Complete Business-Ready Deployment**

This guide will help you deploy your RestNTravel e-commerce application on Hostinger with:
- ✅ **MySQL Database** - Persistent data storage
- ✅ **Node.js Server** - Proper backend API
- ✅ **Hostinger Email** - Working SMTP with your domain
- ✅ **File Upload System** - For images/videos
- ✅ **Production Environment** - Business-ready setup

## 📋 **Prerequisites**

1. ✅ **Hostinger Hosting Plan** - Business or Premium plan (supports Node.js)
2. ✅ **MySQL Database** - Create in Hostinger control panel
3. ✅ **Domain** - `restntravel.shop` (already purchased)
4. ✅ **Email** - `sales@restntravel.shop` (already configured)

## 🔧 **Step 1: Set Up MySQL Database**

### **1.1 Create Database in Hostinger**
1. **Login to Hostinger** control panel
2. **Go to "Databases"** → "MySQL Databases"
3. **Create new database:**
   - **Database name:** `restntravel_db`
   - **Username:** `restntravel_user`
   - **Password:** `[generate strong password]`
4. **Note down these credentials** - you'll need them later

### **1.2 Database Credentials Example:**
```
Database Name: restntravel_db
Database User: restntravel_user
Database Password: YourStrongPassword123!
Database Host: localhost
Database Port: 3306
```

## 🚀 **Step 2: Prepare Your Code**

### **2.1 Build Your Application**
```bash
# Install dependencies
npm install

# Build the React app
npm run build
```

### **2.2 Create Environment File**
Create `.env` file in your project root:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=restntravel_user
DB_PASSWORD=YourStrongPassword123!
DB_NAME=restntravel_db
DB_PORT=3306

# Email Configuration
SALES_EMAIL=sales@restntravel.shop
INFO_EMAIL=info@restntravel.shop
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=sales@restntravel.shop
SMTP_PASS=SalesRNT@8912

# Application Configuration
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DOMAIN=restntravel.shop
PROTOCOL=https
```

## 📁 **Step 3: Upload to Hostinger**

### **3.1 Access File Manager**
1. **Login to Hostinger** control panel
2. **Go to "Files"** → "File Manager"
3. **Navigate to** `public_html` directory

### **3.2 Upload Files**
1. **Upload all project files** to `public_html`
2. **Make sure these files are included:**
   - `server-production.js`
   - `package.json`
   - `dist/` folder (built React app)
   - `config/` folder
   - `routes/` folder
   - `.env` file

### **3.3 File Structure on Hostinger:**
```
public_html/
├── server-production.js
├── package.json
├── .env
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── testimonials.js
│   ├── contact.js
│   └── admin.js
└── dist/
    ├── index.html
    ├── assets/
    └── [other built files]
```

## ⚙️ **Step 4: Configure Node.js**

### **4.1 Install Node.js Dependencies**
1. **In Hostinger File Manager**, open terminal
2. **Navigate to your project directory:**
   ```bash
   cd public_html
   ```
3. **Install dependencies:**
   ```bash
   npm install --production
   ```

### **4.2 Create Startup Script**
Create `start.sh` file in `public_html`:
```bash
#!/bin/bash
cd /home/username/public_html
node server-production.js
```

### **4.3 Make Script Executable**
```bash
chmod +x start.sh
```

## 🌐 **Step 5: Configure Domain**

### **5.1 Set Up Domain**
1. **Go to "Domains"** in Hostinger
2. **Point `restntravel.shop`** to your hosting
3. **Enable SSL certificate** (automatic with Hostinger)

### **5.2 Create .htaccess File**
Create `.htaccess` file in `public_html`:
```apache
RewriteEngine On

# Handle API requests
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ server-production.js [L]

# Handle React routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /dist/index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

## 🔧 **Step 6: Start the Server**

### **6.1 Using Hostinger Terminal**
1. **Open terminal** in Hostinger File Manager
2. **Navigate to project:**
   ```bash
   cd public_html
   ```
3. **Start the server:**
   ```bash
   node server-production.js
   ```

### **6.2 Using PM2 (Recommended)**
1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```
2. **Start with PM2:**
   ```bash
   pm2 start server-production.js --name "restntravel"
   ```
3. **Save PM2 configuration:**
   ```bash
   pm2 save
   pm2 startup
   ```

## 🧪 **Step 7: Test Your Deployment**

### **7.1 Test URLs:**
- **Main Site:** `https://restntravel.shop`
- **Admin Panel:** `https://restntravel.shop/admin`
- **API Health:** `https://restntravel.shop/api/health`
- **Contact:** `https://restntravel.shop/contact`

### **7.2 Test Functionality:**
1. **Login to admin panel** with:
   - Email: `sales@restntravel.shop`
   - Password: `SalesRNT@8912`
2. **Test product management**
3. **Test contact form**
4. **Test order placement**
5. **Check email functionality**

## 📧 **Step 8: Email Configuration**

### **8.1 Verify SMTP Settings**
Your `.env` file should have:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=sales@restntravel.shop
SMTP_PASS=SalesRNT@8912
```

### **8.2 Test Email Sending**
1. **Submit contact form** on your site
2. **Check `sales@restntravel.shop` inbox**
3. **Place test order** and verify order emails

## 🔒 **Step 9: Security & Optimization**

### **9.1 Update JWT Secret**
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Update in `.env` file.

### **9.2 Enable HTTPS**
Hostinger automatically provides SSL certificates.

### **9.3 Set Up Backups**
1. **Database backups** - Set up in Hostinger control panel
2. **File backups** - Regular backups of your code

## 📊 **Step 10: Monitoring**

### **10.1 Check Server Logs**
```bash
# If using PM2
pm2 logs restntravel

# If running directly
tail -f /path/to/your/logs
```

### **10.2 Monitor Database**
- **Check database connections** in Hostinger control panel
- **Monitor disk usage**
- **Check error logs**

## 🎯 **Expected Results**

After deployment:
- ✅ **Site accessible** at `https://restntravel.shop`
- ✅ **Database working** - All data persists
- ✅ **Email functionality** - Contact and order emails sent
- ✅ **Admin panel** - Full CRUD operations
- ✅ **Product management** - Prices don't revert
- ✅ **File uploads** - Images and videos work
- ✅ **SSL certificate** - Secure HTTPS connection

## 🔧 **Troubleshooting**

### **If Database Connection Fails:**
1. **Check database credentials** in `.env`
2. **Verify database exists** in Hostinger
3. **Check database permissions**

### **If Emails Don't Send:**
1. **Verify SMTP credentials**
2. **Check Hostinger email settings**
3. **Test with different SMTP port** (587 vs 465)

### **If Server Won't Start:**
1. **Check Node.js version** (should be 16+)
2. **Verify all dependencies** are installed
3. **Check file permissions**

## 📞 **Support**

If you encounter issues:
1. **Check Hostinger error logs**
2. **Verify all environment variables**
3. **Test database connection**
4. **Contact Hostinger support** if needed

---

## 🎉 **Success!**

Your RestNTravel e-commerce site is now deployed on Hostinger with:
- ✅ **Professional hosting**
- ✅ **MySQL database**
- ✅ **Working email system**
- ✅ **Secure HTTPS**
- ✅ **Business-ready setup**

**Your e-commerce business is now live and ready for customers!** 🚀 