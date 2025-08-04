# 🚀 PHP Backend Deployment Guide - RestNTravel

## 🎯 **Complete PHP Backend for Hostinger Premium**

This guide will help you deploy your RestNTravel e-commerce application with **PHP backend** on Hostinger Premium hosting.

## ✅ **What We've Created:**

- ✅ **PHP API endpoints** (replacing Node.js)
- ✅ **MySQL database integration** (using your existing database)
- ✅ **Email functionality** (using Hostinger email)
- ✅ **Static React frontend** (no changes needed)
- ✅ **Works perfectly on Premium hosting**

## 📋 **Files Created:**

### **API Files:**
- `api/config/database.php` - Database connection
- `api/auth.php` - Login/signup endpoints
- `api/products.php` - Product management
- `api/orders.php` - Order processing with email
- `api/testimonials.php` - Testimonial management
- `api/contact.php` - Contact form with email
- `api/admin.php` - Admin dashboard
- `api/index.php` - API router

### **Configuration:**
- `.htaccess` - Updated for PHP routing
- Database credentials configured

## 🚀 **Deployment Steps:**

### **Step 1: Build Your React App**
```bash
npm run build
```

### **Step 2: Upload to Hostinger**
1. **Go to Hostinger File Manager**
2. **Navigate to `public_html`**
3. **Upload these files/folders:**
   - `api/` folder (all PHP files)
   - `dist/` folder (built React app)
   - `.htaccess` file
   - `Products/` folder (product images)

### **Step 3: Test Your API**
Visit: `https://restntravel.shop/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "environment": "production",
  "message": "RestNTravel API is running"
}
```

### **Step 4: Test Your Site**
- **Main Site:** `https://restntravel.shop`
- **Admin Panel:** `https://restntravel.shop/admin`
- **Login:** `sales@restntravel.shop` / `SalesRNT@8912`

## 🎯 **API Endpoints:**

### **Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile

### **Products:**
- `GET /api/products` - Get active products
- `GET /api/products/admin` - Get all products (admin)
- `POST /api/products` - Add product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### **Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders/admin` - Get all orders (admin)
- `PUT /api/orders/{id}/status` - Update order status (admin)

### **Testimonials:**
- `GET /api/testimonials` - Get active testimonials
- `GET /api/testimonials/admin` - Get all testimonials (admin)
- `POST /api/testimonials` - Add testimonial (admin)
- `PUT /api/testimonials/{id}` - Update testimonial (admin)
- `DELETE /api/testimonials/{id}` - Delete testimonial (admin)

### **Contact:**
- `POST /api/contact` - Submit contact form

### **Admin:**
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/{id}` - Update user (admin)
- `DELETE /api/admin/users/{id}` - Delete user (admin)

## 🎯 **Expected Results:**

After deployment:
- ✅ **Site accessible** at `https://restntravel.shop`
- ✅ **Database working** - All data persists
- ✅ **Email functionality** - Contact and order emails sent
- ✅ **Admin panel** - Full CRUD operations
- ✅ **Product management** - Prices don't revert
- ✅ **File uploads** - Images and videos work
- ✅ **SSL certificate** - Secure HTTPS connection

## 🔧 **Troubleshooting:**

### **If API Returns 404:**
1. **Check `.htaccess` file** is uploaded correctly
2. **Verify `api/` folder** is in `public_html`
3. **Check file permissions** (should be 644 for PHP files)

### **If Database Connection Fails:**
1. **Check database credentials** in `api/config/database.php`
2. **Verify database exists** in Hostinger
3. **Test connection** via phpMyAdmin

### **If Emails Don't Send:**
1. **Check Hostinger email settings**
2. **Verify email configuration** in contact.php and orders.php
3. **Test email** via Hostinger control panel

## 📞 **Support:**

If you encounter issues:
1. **Check Hostinger error logs**
2. **Test API endpoints** individually
3. **Verify database connection**
4. **Contact Hostinger support** if needed

---

## 🎉 **Success!**

Your RestNTravel e-commerce site is now deployed on Hostinger Premium with:
- ✅ **PHP backend** (works on Premium hosting)
- ✅ **MySQL database** (u897731037_restntravel_db)
- ✅ **Working email system**
- ✅ **Secure HTTPS**
- ✅ **Business-ready setup**

**Your e-commerce business is now live and ready for customers!** 🚀 