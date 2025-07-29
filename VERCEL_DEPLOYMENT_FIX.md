# 🔧 Vercel Deployment Fix - 404 & Email Issues

## 🚨 **Problems Identified:**
1. **404 Error** at `restntravel.shop/admin` - Admin panel not accessible
2. **Emails not sending** - SMTP configuration issues
3. **Domain configuration** - DNS/Deployment problems

## ✅ **Step 1: Check Vercel Deployment**

### **1.1 Verify Deployment Status**
1. **Go to your Vercel dashboard**
2. **Check if your project is deployed** (should show green "Ready" status)
3. **Look for any build errors** in the deployment logs

### **1.2 Check Build Logs**
1. **Click on your project** in Vercel dashboard
2. **Go to "Deployments"** tab
3. **Click on the latest deployment**
4. **Check for any build errors**

**Common Build Errors:**
- Missing dependencies
- Build command issues
- Environment variable problems

## 🔧 **Step 2: Fix Build Configuration**

### **2.1 Update vercel.json**
Your `vercel.json` might need adjustment:

```json
{
  "version": 2,
  "builds": [
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
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
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

### **2.2 Check package.json**
Make sure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

## 🚀 **Step 3: Redeploy to Vercel**

### **3.1 Force Redeploy**
1. **Go to Vercel dashboard**
2. **Click on your project**
3. **Click "Redeploy"** button
4. **Wait for build to complete**

### **3.2 Check Deployment URL**
1. **After redeploy, check the Vercel URL** (something like `https://your-project.vercel.app`)
2. **Test the admin panel** at that URL first
3. **If it works there, the issue is with domain configuration**

## 🌐 **Step 4: Fix Domain Configuration**

### **4.1 Check Domain Status in Vercel**
1. **Go to Settings → Domains**
2. **Check if domains show "Valid"** status
3. **If "Invalid Configuration", fix DNS records**

### **4.2 DNS Records for Hostinger**
In your Hostinger control panel:

**Add these DNS records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.19 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

### **4.3 Alternative: Use Vercel Nameservers**
1. **In Vercel** → Domains → `restntravel.shop`
2. **Click "Configure"** → "Nameservers"
3. **Copy the nameservers**
4. **Update in Hostinger** domain settings

## 📧 **Step 5: Fix Email Configuration**

### **5.1 Check Environment Variables**
In Vercel dashboard → Settings → Environment Variables:

**Make sure these are set:**
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

### **5.2 Test Email API**
1. **Go to your Vercel URL** (not domain yet)
2. **Test contact form**
3. **Check Vercel function logs** for email errors

## 🧪 **Step 6: Testing Checklist**

### **Test on Vercel URL First:**
- [ ] **Visit:** `https://your-project.vercel.app`
- [ ] **Test admin panel:** `https://your-project.vercel.app/admin`
- [ ] **Test contact form**
- [ ] **Test order placement**

### **Test on Custom Domain:**
- [ ] **Visit:** `https://restntravel.shop`
- [ ] **Test admin panel:** `https://restntravel.shop/admin`
- [ ] **Test contact form**
- [ ] **Test order placement**

## 🔍 **Step 7: Debugging**

### **If Admin Panel Still 404:**
1. **Check if React Router is configured correctly**
2. **Verify the admin route exists in your code**
3. **Check if the build includes all files**

### **If Emails Still Not Working:**
1. **Check Vercel function logs**
2. **Verify SMTP credentials**
3. **Test with a different email service**

## 📋 **Quick Fix Commands:**

```bash
# 1. Test build locally
npm run build

# 2. Check if dist folder is created
ls -la dist/

# 3. Test locally
npm run preview
```

## 🎯 **Expected Results:**

After fixes:
- ✅ **Vercel deployment** shows "Ready" status
- ✅ **Admin panel** accessible at `/admin`
- ✅ **Contact form** sends emails
- ✅ **Domain** shows "Valid" status
- ✅ **Site works** at `https://restntravel.shop`

## 🔧 **If Still Having Issues:**

### **Contact Vercel Support:**
1. **Go to Vercel dashboard**
2. **Click "Help"** → "Contact Support"
3. **Provide deployment logs**

### **Alternative: Use Netlify**
If Vercel continues having issues:
1. **Deploy to Netlify** instead
2. **Same domain configuration**
3. **Often more reliable** for React apps

---

## ✅ **Success Indicators:**

- ✅ No 404 errors
- ✅ Admin panel accessible
- ✅ Emails sending successfully
- ✅ Domain working properly
- ✅ All features functional

**Follow these steps to fix your deployment issues!** 🚀 