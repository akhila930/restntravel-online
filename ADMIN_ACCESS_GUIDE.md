# 🔧 Admin Panel Access Guide

## 🎯 **Current Issue**
You're currently on the product detail page (`/product/1`), but you need to access the **Admin Panel** to edit products.

---

## ✅ **How to Access Admin Panel**

### **Step 1: Go to Admin Panel**
1. **Open a new browser tab**
2. **Go to**: http://localhost:8080/admin
3. **You should see**: Admin dashboard with statistics

### **Step 2: Verify You're Logged In**
- **If you see a login page**: Login with `admin@restntravel.com` / `admin123`
- **If you see the dashboard**: You're already logged in ✅

---

## 🛠️ **Product Management in Admin Panel**

### **View All Products**
1. **Click "Products" tab** in the admin panel
2. **You'll see**: All products with edit/delete buttons

### **Edit a Product**
1. **Click the "Edit" button** (pencil icon) on any product
2. **A dialog opens** with the product form
3. **Modify any field**:
   - Product name
   - Price
   - Description
   - Category
   - Image filename
   - Active status
4. **Click "Update Product"** to save

### **Add New Product**
1. **Click "Add Product"** button
2. **Fill the form**:
   - Name: Product name
   - Category: pillows, mattresses, quilts, beanbags
   - Price: Product price in ₹
   - Image: Image filename (upload to `/public/Products/`)
   - Description: Product description
   - Active: Check to make visible
3. **Click "Add Product"** to create

### **Delete a Product**
1. **Click the "Delete" button** (trash icon) on any product
2. **Confirm deletion** in the popup

---

## 🔍 **Troubleshooting**

### **If Admin Panel Shows Loading:**
1. **Check if you're logged in**
2. **Refresh the page**
3. **Check browser console for errors**

### **If Edit Button Doesn't Work:**
1. **Make sure you're on the Products tab**
2. **Click the pencil icon next to any product**
3. **A dialog should open with the edit form**

### **If You Can't Access Admin Panel:**
1. **Go to**: http://localhost:8080
2. **Login first**: Click user icon → Login
3. **Then go to**: http://localhost:8080/admin

---

## 📊 **What You Should See**

### **Admin Dashboard:**
- Statistics cards (Total Products, Orders, Users, Revenue)
- Recent orders and users
- Navigation tabs: Dashboard, Products, Orders, Users

### **Products Tab:**
- Product cards with images
- Edit and Delete buttons on each product
- "Add Product" button at the top
- Active/Inactive status badges

---

## 🎯 **Quick Test**

1. **Go to**: http://localhost:8080/admin
2. **Click "Products" tab**
3. **Click "Edit" on the first product**
4. **Change the price** from ₹100 to ₹150
5. **Click "Update Product"**
6. **Verify the change** in the product list

---

## 📞 **Still Having Issues?**

If you're still unable to access or use the admin panel:

1. **Check browser console** (F12 → Console tab) for errors
2. **Make sure both servers are running**:
   ```bash
   npm run dev:full
   ```
3. **Try a different browser** or incognito mode
4. **Clear browser cache** and try again

**The admin panel is working perfectly** - you just need to access it at the correct URL! 🚀 