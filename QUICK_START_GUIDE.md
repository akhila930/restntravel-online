# 🚀 Quick Start Guide - RestNTravel Admin Panel

## ✅ **Current Status: READY TO USE**

Both development servers are running and all functionality is working perfectly!

---

## 🌐 **How to Access Your Application**

### **1. Main Application**
- **URL**: http://localhost:8080
- **Status**: ✅ Running and accessible

### **2. Admin Panel**
- **URL**: http://localhost:8080/admin
- **Status**: ✅ Running and accessible

---

## 🔐 **Login Credentials**

I've created a test admin account for you:

### **Admin Account:**
- **Email**: `admin@restntravel.com`
- **Password**: `admin123`
- **Name**: Admin User

### **How to Login:**
1. **Go to**: http://localhost:8080
2. **Click the user icon** in the top-right corner of the header
3. **Enter credentials**:
   - Email: `admin@restntravel.com`
   - Password: `admin123`
4. **Click "Sign In"**

---

## 🛠️ **Admin Panel Features**

### **✅ Dashboard**
- **Statistics**: Total products, orders, users, revenue
- **Recent Activity**: Latest orders and user registrations
- **Real-time Data**: Auto-refreshes

### **✅ Product Management**
- **View All Products**: See all products with images and details
- **Add New Product**: Complete form with all fields
- **Edit Products**: Click edit button to modify any product
- **Delete Products**: Remove products with confirmation
- **Product Status**: Toggle active/inactive

### **✅ Order Management**
- **View All Orders**: Order details, customer info, status
- **Update Status**: Pending → Confirmed → Processing → Shipped → Delivered
- **Order Details**: Customer info, items, total amount, date

### **✅ User Management**
- **View All Users**: Registered customers with registration dates
- **User Orders**: Click "View Orders" to see order history for each user
- **User Details**: Name, email, join date

---

## 🔧 **Development Servers**

### **Current Status:**
- **API Server**: ✅ Running on http://localhost:3001
- **Frontend Server**: ✅ Running on http://localhost:8080

### **If you need to restart servers:**

#### **Option 1: Start Both Servers**
```bash
npm run dev:full
```

#### **Option 2: Start Servers Separately**
```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Frontend Server  
npm run dev:frontend
```

---

## 🎯 **Step-by-Step Access Guide**

### **Step 1: Access the Application**
1. **Open your browser**
2. **Go to**: http://localhost:8080
3. **You should see**: RestNTravel homepage with navigation

### **Step 2: Login**
1. **Click the user icon** (top-right corner)
2. **Enter credentials**:
   - Email: `admin@restntravel.com`
   - Password: `admin123`
3. **Click "Sign In"**
4. **You should see**: User dropdown with your name

### **Step 3: Access Admin Panel**
1. **After login, go to**: http://localhost:8080/admin
2. **You should see**: Admin dashboard with statistics
3. **Navigate tabs**: Dashboard, Products, Orders, Users

### **Step 4: Test Admin Features**
1. **Products Tab**: View, add, edit, delete products
2. **Orders Tab**: View orders and update status
3. **Users Tab**: View users and their orders

---

## 🛍️ **Testing E-commerce Features**

### **1. Product Browsing**
- **Go to**: http://localhost:8080/shop
- **Browse products**: View all available products
- **Add to cart**: Click "Add to Cart" on any product

### **2. Shopping Cart**
- **Go to**: http://localhost:8080/cart
- **View cart**: See added items
- **Update quantities**: Use +/- buttons
- **Remove items**: Click trash icon

### **3. Order Placement**
- **Login first** (required for orders)
- **Add items to cart**
- **Go to cart**: http://localhost:8080/cart
- **Fill billing information**
- **Place order**: Click "Place Order"

---

## 🔍 **Troubleshooting**

### **If you see "This site can't be reached":**
1. **Check if servers are running**:
   ```bash
   # Check API server
   curl http://localhost:3001/api/auth
   
   # Check frontend server
   curl http://localhost:8080
   ```

2. **Restart servers if needed**:
   ```bash
   npm run dev:full
   ```

### **If login fails:**
1. **Check browser console** for errors
2. **Verify API server is running** on port 3001
3. **Try the test credentials**:
   - Email: `admin@restntravel.com`
   - Password: `admin123`

### **If admin panel doesn't load:**
1. **Make sure you're logged in**
2. **Go directly to**: http://localhost:8080/admin
3. **Check browser console** for errors

---

## 📊 **What's Working**

### **✅ Authentication System**
- User registration and login
- JWT token management
- Session persistence

### **✅ Admin Panel**
- Complete product management
- Order status management
- User management
- Dashboard analytics

### **✅ E-commerce Features**
- Product browsing
- Shopping cart
- Order placement
- Email notifications (development mode)

### **✅ API Endpoints**
- Authentication: `/api/auth`
- Orders: `/api/order`
- Admin: `/api/admin`
- All endpoints responding correctly

---

## 🎉 **You're All Set!**

Your RestNTravel application is fully functional with:

- ✅ **Working login system**
- ✅ **Complete admin panel**
- ✅ **Product management**
- ✅ **Order management**
- ✅ **User management**
- ✅ **E-commerce functionality**

**Start managing your store now!** 🚀

---

## 📞 **Need Help?**

If you encounter any issues:

1. **Check this guide** for troubleshooting steps
2. **Verify servers are running** on correct ports
3. **Use the test credentials** provided above
4. **Check browser console** for error messages

**Your RestNTravel admin panel is ready to use!** 🎯 