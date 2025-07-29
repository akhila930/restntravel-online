# 🚀 Quick Deployment Guide - RestNTravel

## ⚡ **Fast Track to Production**

This guide will get your RestNTravel site live at `https://restntravel.shop` in under 30 minutes!

## 📋 **Prerequisites (5 minutes)**

1. ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. ✅ **GitHub Account** - For code repository
3. ✅ **Custom Domain** - `restntravel.shop` (already purchased)

## 🔄 **Step 1: Push Code to GitHub (5 minutes)**

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit for RestNTravel"

# Create GitHub repository at github.com
# Name it: restntravel-online

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/restntravel-online.git
git branch -M main
git push -u origin main
```

## 🚀 **Step 2: Deploy to Vercel (10 minutes)**

### **Option A: Using Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository** (`restntravel-online`)
4. **Configure project:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Add Environment Variables:**
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
   ```
6. **Click "Deploy"**

### **Option B: Using Deployment Script**

```bash
# Run the deployment script
./deploy-to-vercel.sh
```

## 🌐 **Step 3: Connect Custom Domain (10 minutes)**

### **3.1 Add Domain in Vercel**

1. **Go to your Vercel project dashboard**
2. **Click "Settings" → "Domains"**
3. **Add domain:** `restntravel.shop`
4. **Click "Add"**

### **3.2 Configure DNS Records**

In your domain provider (where you bought `restntravel.shop`):

**Add these DNS records:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.19 |
| CNAME | www | cname.vercel-dns.com |

### **3.3 Verify Domain**

- **Wait for DNS propagation** (can take up to 48 hours)
- **Check domain status** in Vercel dashboard
- **Domain should show as "Valid"**

## 🧪 **Step 4: Test Your Live Site (5 minutes)**

### **Test URLs:**
- **Main Site:** `https://restntravel.shop`
- **Admin Panel:** `https://restntravel.shop/admin`
- **Contact:** `https://restntravel.shop/contact`
- **Shop:** `https://restntravel.shop/shop`

### **Test Checklist:**
- [ ] **Visit main site** - Should load correctly
- [ ] **Test contact form** - Submit a test message
- [ ] **Test order placement** - Add items to cart and place order
- [ ] **Check admin panel** - Login with:
  - Email: `sales@restntravel.shop`
  - Password: `SalesRNT@8912`
- [ ] **Verify emails** - Check `sales@restntravel.shop` inbox

## 📧 **Email Testing**

### **Contact Form Test:**
1. Go to `https://restntravel.shop/contact`
2. Fill out the form
3. Submit
4. Check `sales@restntravel.shop` inbox

### **Order Test:**
1. Go to `https://restntravel.shop/shop`
2. Add items to cart
3. Place order
4. Check `sales@restntravel.shop` inbox for order notification

## 🔧 **Troubleshooting**

### **If deployment fails:**
1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Check package.json** has correct build script

### **If domain doesn't work:**
1. **Check DNS records** are configured correctly
2. **Wait for DNS propagation** (up to 48 hours)
3. **Verify domain status** in Vercel dashboard

### **If emails don't work:**
1. **Check SMTP credentials** in environment variables
2. **Verify Hostinger email** is working
3. **Check spam folder** for test emails

## 🎯 **Success Indicators**

✅ **Site loads at https://restntravel.shop**
✅ **Contact form sends emails to sales@restntravel.shop**
✅ **Orders send notifications to sales@restntravel.shop**
✅ **Admin panel accessible at /admin**
✅ **SSL certificate active (https)**
✅ **Professional email templates working**

## 📞 **Support**

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Verify all environment variables are set**
3. **Test email functionality locally first**
4. **Check DNS configuration**

---

## 🎉 **Congratulations!**

Your RestNTravel e-commerce site is now live at `https://restntravel.shop`!

**Total time: ~30 minutes**
**Cost: Free (Vercel hosting)**
**Domain: Your purchased restntravel.shop**

**🚀 Your business is now online and ready for customers!** 