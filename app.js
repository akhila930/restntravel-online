// RestNTravel Complete Static E-commerce Site

// Sample data
let products = JSON.parse(localStorage.getItem('products')) || [
    {id: 1, name: "Organic Cotton T-Shirt", price: 29.99, category: "Clothing", image: "/Products/tshirt.jpg", description: "Comfortable organic cotton t-shirt made from sustainable materials."},
    {id: 2, name: "Bamboo Water Bottle", price: 24.99, category: "Accessories", image: "/Products/bottle.jpg", description: "Eco-friendly bamboo water bottle that keeps drinks cold for hours."},
    {id: 3, name: "Hemp Backpack", price: 49.99, category: "Bags", image: "/Products/backpack.jpg", description: "Sustainable hemp backpack perfect for daily use."},
    {id: 4, name: "Recycled Paper Notebook", price: 12.99, category: "Stationery", image: "/Products/notebook.jpg", description: "100% recycled paper notebook for eco-conscious note-taking."},
    {id: 5, name: "Organic Soap Bar", price: 8.99, category: "Personal Care", image: "/Products/soap.jpg", description: "Natural organic soap bar made with pure ingredients."},
    {id: 6, name: "Bamboo Toothbrush", price: 6.99, category: "Personal Care", image: "/Products/toothbrush.jpg", description: "Biodegradable bamboo toothbrush for sustainable oral care."}
];

let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [
    {id: 1, name: "Sarah Johnson", rating: 5, comment: "Amazing quality products! The organic cotton t-shirt is so comfortable and the bamboo water bottle keeps my drinks cold for hours. Highly recommend RestNTravel!", product: "Clothing"},
    {id: 2, name: "Michael Chen", rating: 5, comment: "Great customer service and fast delivery. The hemp backpack is perfect for my daily commute. Love supporting eco-friendly brands!", product: "Bags"},
    {id: 3, name: "Emily Rodriguez", rating: 4, comment: "The recycled paper notebook is exactly what I needed for my studies. Good quality and environmentally conscious. Will definitely buy more!", product: "Stationery"},
    {id: 4, name: "David Thompson", rating: 5, comment: "Switched to the bamboo toothbrush and organic soap. My teeth feel cleaner and my skin is healthier. Great sustainable alternatives!", product: "Personal Care"}
];

let users = JSON.parse(localStorage.getItem('users')) || [
    {id: 1, name: "Admin", email: "sales@restntravel.shop", password: "SalesRNT@8912", role: "admin"}
];

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    updateCartCount();
    setupAllForms();
    if (currentUser && currentUser.role === 'admin') {
        showPage('admin');
    }
});

// Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) targetPage.classList.add('active');
    
    switch(pageName) {
        case 'home': loadFeaturedProducts(); break;
        case 'products': loadProducts(); break;
        case 'testimonials': loadTestimonials(); break;
        case 'admin': 
            if (currentUser && currentUser.role === 'admin') loadAdminDashboard();
            else showPage('login');
            break;
    }
}

// Load data
function loadAllData() {
    loadProducts();
    loadTestimonials();
    loadFeaturedProducts();
    if (currentUser && currentUser.role === 'admin') loadAdminDashboard();
}

function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md product-card transition duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-t-lg" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-green-600">₹${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadFeaturedProducts() {
    const grid = document.getElementById('featured-products');
    if (!grid) return;
    const featured = products.slice(0, 3);
    grid.innerHTML = featured.map(product => `
        <div class="bg-white rounded-lg shadow-md product-card transition duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-t-lg" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-green-600">₹${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;
    grid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card rounded-lg p-6">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">${testimonial.name.charAt(0)}</div>
                <div class="ml-3">
                    <h4 class="font-semibold">${testimonial.name}</h4>
                    <div class="text-yellow-500">${'⭐'.repeat(testimonial.rating)}</div>
                </div>
            </div>
            <p class="text-gray-700 mb-2">"${testimonial.comment}"</p>
            <span class="text-sm text-green-600">Product: ${testimonial.product}</span>
        </div>
    `).join('');
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({id: product.id, name: product.name, price: product.price, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal.classList.contains('hidden')) {
        cartModal.classList.remove('hidden');
        updateCartDisplay();
    } else {
        cartModal.classList.add('hidden');
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500">Your cart is empty</p>';
        cartTotal.textContent = '₹0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-gray-600">₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="font-semibold">₹${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">✕</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to checkout!');
        showPage('login');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        id: Date.now(),
        orderNumber: 'REST' + Date.now(),
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        items: [...cart],
        total: total,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    toggleCart();
    
    showNotification('Order placed successfully! Check your email for confirmation.');
}

// User functions
function toggleUserMenu() {
    const userModal = document.getElementById('user-modal');
    const userContent = document.getElementById('user-content');
    
    if (userModal.classList.contains('hidden')) {
        userModal.classList.remove('hidden');
        if (currentUser) {
            userContent.innerHTML = `
                <div class="space-y-4">
                    <h4 class="font-semibold">Welcome, ${currentUser.name}!</h4>
                    <p class="text-gray-600">Email: ${currentUser.email}</p>
                    <div class="pt-4 space-y-2">
                        <button onclick="showPage('admin')" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Admin Panel</button>
                        <button onclick="logout()" class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">Logout</button>
                    </div>
                </div>
            `;
        } else {
            userContent.innerHTML = `
                <div class="space-y-4">
                    <h4 class="font-semibold">Welcome to RestNTravel</h4>
                    <p class="text-gray-600">Please login to access your account</p>
                    <div class="pt-4">
                        <button onclick="showPage('login')" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Login</button>
                    </div>
                </div>
            `;
        }
    } else {
        userModal.classList.add('hidden');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('home');
    showNotification('Logged out successfully!');
}

// Admin functions
function showAdminSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) targetSection.classList.add('active');
    
    document.querySelectorAll('.admin-nav').forEach(nav => {
        nav.classList.remove('bg-green-600');
        nav.classList.add('bg-gray-600');
    });
    
    const activeNav = document.querySelector(`[onclick="showAdminSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.remove('bg-gray-600');
        activeNav.classList.add('bg-green-600');
    }
    
    switch(sectionName) {
        case 'dashboard': loadAdminDashboard(); break;
        case 'products': loadAdminProducts(); break;
        case 'orders': loadAdminOrders(); break;
        case 'users': loadAdminUsers(); break;
        case 'testimonials': loadAdminTestimonials(); break;
    }
}

function loadAdminDashboard() {
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-products').textContent = products.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersDiv = document.getElementById('recent-orders');
    
    if (recentOrders.length === 0) {
        recentOrdersDiv.innerHTML = '<p class="text-gray-500">No orders yet</p>';
    } else {
        recentOrdersDiv.innerHTML = recentOrders.map(order => `
            <div class="border-b py-3">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold">Order #${order.orderNumber}</h4>
                        <p class="text-sm text-gray-600">${order.customerName} - ${order.customerEmail}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">₹${order.total.toFixed(2)}</p>
                        <p class="text-sm text-gray-600">${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadAdminProducts() {
    const grid = document.getElementById('admin-products-grid');
    grid.innerHTML = products.map(product => `
        <div class="border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold">${product.name}</h4>
                    <p class="text-gray-600">${product.description}</p>
                    <p class="text-green-600 font-semibold">₹${product.price}</p>
                    <p class="text-sm text-gray-500">Category: ${product.category}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="deleteProduct(${product.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    if (orders.length === 0) {
        list.innerHTML = '<p class="text-gray-500">No orders yet</p>';
        return;
    }
    
    list.innerHTML = orders.map(order => `
        <div class="border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold">Order #${order.orderNumber}</h4>
                    <p class="text-gray-600">${order.customerName} - ${order.customerEmail}</p>
                    <p class="text-green-600 font-semibold">₹${order.total.toFixed(2)}</p>
                    <p class="text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</p>
                    <p class="text-sm">Status: <span class="font-semibold">${order.status}</span></p>
                </div>
                <div class="flex space-x-2">
                    <select onchange="updateOrderStatus(${order.id}, this.value)" class="border rounded px-2 py-1">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAdminUsers() {
    const list = document.getElementById('admin-users-list');
    list.innerHTML = users.map(user => `
        <div class="border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">${user.name}</h4>
                    <p class="text-gray-600">${user.email}</p>
                    <p class="text-sm text-gray-500">Role: ${user.role}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="deleteUser(${user.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAdminTestimonials() {
    const grid = document.getElementById('admin-testimonials-grid');
    grid.innerHTML = testimonials.map(testimonial => `
        <div class="border rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold">${testimonial.name}</h4>
                    <div class="text-yellow-500 mb-2">${'⭐'.repeat(testimonial.rating)}</div>
                    <p class="text-gray-600">"${testimonial.comment}"</p>
                    <p class="text-sm text-gray-500">Product: ${testimonial.product}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="deleteTestimonial(${testimonial.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Admin actions
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        showNotification('Order status updated!');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
        showNotification('Product deleted!');
    }
}

function deleteTestimonial(testimonialId) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        testimonials = testimonials.filter(t => t.id !== testimonialId);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadAdminTestimonials();
        showNotification('Testimonial deleted!');
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadAdminUsers();
        showNotification('User deleted!');
    }
}

// Modal functions
function showAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('hidden');
}

function hideAddProductModal() {
    document.getElementById('add-product-modal').classList.add('hidden');
}

function showAddTestimonialModal() {
    document.getElementById('add-testimonial-modal').classList.remove('hidden');
}

function hideAddTestimonialModal() {
    document.getElementById('add-testimonial-modal').classList.add('hidden');
}

// Setup forms
function setupAllForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification('Login successful!');
                
                if (user.role === 'admin') {
                    showPage('admin');
                } else {
                    showPage('home');
                }
            } else {
                showNotification('Invalid credentials!');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!');
                return;
            }
            
            if (users.find(u => u.email === email)) {
                showNotification('Email already exists!');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: 'customer'
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            showNotification('Registration successful!');
            showPage('home');
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            console.log('Contact email would be sent to sales@restntravel.shop:', data);
            contactForm.reset();
            showNotification('Message sent successfully! We\'ll get back to you soon.');
        });
    }
    
    // Add product form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            const newProduct = {
                id: Date.now(),
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                description: formData.get('description'),
                image: formData.get('image')
            };
            
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            
            addProductForm.reset();
            hideAddProductModal();
            loadAdminProducts();
            showNotification('Product added successfully!');
        });
    }
    
    // Add testimonial form
    const addTestimonialForm = document.getElementById('add-testimonial-form');
    if (addTestimonialForm) {
        addTestimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addTestimonialForm);
            const newTestimonial = {
                id: Date.now(),
                name: formData.get('name'),
                rating: parseInt(formData.get('rating')),
                comment: formData.get('comment'),
                product: formData.get('product')
            };
            
            testimonials.push(newTestimonial);
            localStorage.setItem('testimonials', JSON.stringify(testimonials));
            
            addTestimonialForm.reset();
            hideAddTestimonialModal();
            loadAdminTestimonials();
            showNotification('Testimonial added successfully!');
        });
    }
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = ['cart-modal', 'user-modal', 'add-product-modal', 'add-testimonial-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}); 