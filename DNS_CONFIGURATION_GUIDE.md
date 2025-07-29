# 🔧 DNS Configuration Fix - restntravel.shop

## 🚨 **Problem Identified:**
Both domains are showing "Invalid Configuration" because DNS records haven't been set up in your domain provider.

## ✅ **Solution: Configure DNS Records**

### **Step 1: Identify Your Domain Provider**

**Where did you buy `restntravel.shop`?**
- **Hostinger** (most likely)
- **GoDaddy**
- **Namecheap**
- **Google Domains**
- **Cloudflare**
- **Other**

### **Step 2: Configure DNS Records**

#### **For Hostinger (Most Common):**

1. **Login to Hostinger** control panel
2. **Go to "Domains"** → Find `restntravel.shop`
3. **Click "Manage"** → "DNS Zone Editor"
4. **Add these records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.19 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

#### **For GoDaddy:**

1. **Login to GoDaddy** account
2. **Go to "My Products"** → "DNS"
3. **Find `restntravel.shop`** → "DNS"
4. **Add these records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.19 | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

#### **For Namecheap:**

1. **Login to Namecheap** account
2. **Go to "Domain List"** → Find `restntravel.shop`
3. **Click "Manage"** → "Advanced DNS"
4. **Add these records:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.19.19 | Automatic |
| CNAME Record | www | cname.vercel-dns.com | Automatic |

#### **For Google Domains:**

1. **Login to Google Domains**
2. **Select `restntravel.shop`**
3. **Go to "DNS"** → "Custom records"
4. **Add these records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.19 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

### **Step 3: Wait for DNS Propagation**

After adding DNS records:
- **Wait 5-30 minutes** for initial propagation
- **Can take up to 48 hours** for full propagation
- **Check status** in Vercel dashboard

### **Step 4: Verify in Vercel**

1. **Go back to Vercel** → Domains settings
2. **Click "Refresh"** on both domains
3. **Status should change** from "Invalid Configuration" to "Valid"

## 🔍 **How to Check DNS Propagation**

### **Online DNS Checker:**
1. Go to [whatsmydns.net](https://whatsmydns.net)
2. Enter `restntravel.shop`
3. Check A record points to `76.76.19.19`
4. Check CNAME record points to `cname.vercel-dns.com`

### **Command Line Check:**
```bash
# Check A record
nslookup restntravel.shop

# Check CNAME record
nslookup www.restntravel.shop
```

## 🚀 **Alternative: Use Vercel DNS (Easier)**

If your domain provider supports it, you can use Vercel's nameservers:

### **Step 1: Get Vercel Nameservers**
1. In Vercel → Domains → `restntravel.shop`
2. Click "Configure" → "Nameservers"
3. Copy the nameservers provided

### **Step 2: Update Nameservers**
In your domain provider:
1. Go to domain settings
2. Find "Nameservers" or "DNS"
3. Replace with Vercel nameservers
4. Save changes

## 📋 **Quick Fix Checklist:**

- [ ] **Identify domain provider**
- [ ] **Add A record:** @ → 76.76.19.19
- [ ] **Add CNAME record:** www → cname.vercel-dns.com
- [ ] **Wait 5-30 minutes**
- [ ] **Refresh in Vercel**
- [ ] **Check status changes to "Valid"**

## 🎯 **Expected Result:**

After DNS configuration:
- ✅ **restntravel.shop** → "Valid" status
- ✅ **www.restntravel.shop** → "Valid" status
- ✅ **Site accessible** at https://restntravel.shop
- ✅ **SSL certificate** automatically issued

## 🔧 **Troubleshooting:**

### **If still "Invalid Configuration":**
1. **Double-check DNS records** are exactly as shown
2. **Wait longer** for DNS propagation
3. **Check domain provider** for any restrictions
4. **Contact domain provider** support if needed

### **If you can't find DNS settings:**
1. **Contact your domain provider** support
2. **Ask them to add the DNS records** for you
3. **Provide them with the exact records** from above

---

## ✅ **Success Indicators:**

- ✅ DNS records configured correctly
- ✅ Vercel shows "Valid" status
- ✅ Domain accessible at https://restntravel.shop
- ✅ SSL certificate working
- ✅ www subdomain redirecting properly

**Once DNS is configured, your RestNTravel site will be live!** 🚀 