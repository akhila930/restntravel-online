// RestNTravel E-commerce Site JavaScript

// Sample data (in a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        category: "Clothing",
        image: "/Products/tshirt.jpg",
        description: "Comfortable organic cotton t-shirt made from sustainable materials."
    },
    {
        id: 2,
        name: "Bamboo Water Bottle",
        price: 24.99,
        category: "Accessories",
        image: "/Products/bottle.jpg",
        description: "Eco-friendly bamboo water bottle that keeps drinks cold for hours."
    },
    {
        id: 3,
        name: "Hemp Backpack",
        price: 49.99,
        category: "Bags",
        image: "/Products/backpack.jpg",
        description: "Sustainable hemp backpack perfect for daily use."
    },
    {
        id: 4,
        name: "Recycled Paper Notebook",
        price: 12.99,
        category: "Stationery",
        image: "/Products/notebook.jpg",
        description: "100% recycled paper notebook for eco-conscious note-taking."
    },
    {
        id: 5,
        name: "Organic Soap Bar",
        price: 8.99,
        category: "Personal Care",
        image: "/Products/soap.jpg",
        description: "Natural organic soap bar made with pure ingredients."
    },
    {
        id: 6,
        name: "Bamboo Toothbrush",
        price: 6.99,
        category: "Personal Care",
        image: "/Products/toothbrush.jpg",
        description: "Biodegradable bamboo toothbrush for sustainable oral care."
    }
];

const testimonials = [
    {
        name: "Sarah Johnson",
        rating: 5,
        comment: "Amazing quality products! The organic cotton t-shirt is so comfortable and the bamboo water bottle keeps my drinks cold for hours. Highly recommend RestNTravel!",
        product: "Clothing"
    },
    {
        name: "Michael Chen",
        rating: 5,
        comment: "Great customer service and fast delivery. The hemp backpack is perfect for my daily commute. Love supporting eco-friendly brands!",
        product: "Bags"
    },
    {
        name: "Emily Rodriguez",
        rating: 4,
        comment: "The recycled paper notebook is exactly what I needed for my studies. Good quality and environmentally conscious. Will definitely buy more!",
        product: "Stationery"
    },
    {
        name: "David Thompson",
        rating: 5,
        comment: "Switched to the bamboo toothbrush and organic soap. My teeth feel cleaner and my skin is healthier. Great sustainable alternatives!",
        product: "Personal Care"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadTestimonials();
    updateCartCount();
    setupContactForm();
    setupUserMenu();
});

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="bg-white rounded-lg shadow-md product-card transition duration-300">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 object-cover rounded-t-lg"
                     onerror="this.src='/placeholder.svg'">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-600">₹${product.price}</span>
                        <button onclick="addToCart(${product.id})" 
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

// Load testimonials
function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    testimonialsGrid.innerHTML = '';

    testimonials.forEach(testimonial => {
        const stars = '⭐'.repeat(testimonial.rating);
        const testimonialCard = `
            <div class="testimonial-card rounded-lg p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        ${testimonial.name.charAt(0)}
                    </div>
                    <div class="ml-3">
                        <h4 class="font-semibold">${testimonial.name}</h4>
                        <div class="text-yellow-500">${stars}</div>
                    </div>
                </div>
                <p class="text-gray-700 mb-2">"${testimonial.comment}"</p>
                <span class="text-sm text-green-600">Product: ${testimonial.product}</span>
            </div>
        `;
        testimonialsGrid.innerHTML += testimonialCard;
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
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
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = `
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
        cartItems.innerHTML += cartItem;
    });

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

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simple checkout - in a real app, this would redirect to a payment gateway
    const orderDetails = {
        items: cart,
        total: total,
        orderNumber: 'REST' + Date.now(),
        date: new Date().toISOString()
    };

    // Send order email (simplified)
    sendOrderEmail(orderDetails);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    toggleCart();
    
    showNotification('Order placed successfully! Check your email for confirmation.');
}

// User menu functions
function toggleUserMenu() {
    const userModal = document.getElementById('user-modal');
    const userContent = document.getElementById('user-content');
    
    if (userModal.classList.contains('hidden')) {
        userModal.classList.remove('hidden');
        userContent.innerHTML = `
            <div class="space-y-4">
                <h4 class="font-semibold">Welcome to RestNTravel</h4>
                <p class="text-gray-600">For orders and inquiries, please contact us at:</p>
                <p class="text-green-600 font-semibold">sales@restntravel.shop</p>
                <div class="pt-4">
                    <button onclick="toggleUserMenu()" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        Close
                    </button>
                </div>
            </div>
        `;
    } else {
        userModal.classList.add('hidden');
    }
}

// Contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Send contact email (simplified)
        sendContactEmail(data);
        
        contactForm.reset();
        showNotification('Message sent successfully! We\'ll get back to you soon.');
    });
}

// Email functions (simplified - in a real app, these would use a backend service)
function sendOrderEmail(orderDetails) {
    // This would normally send an email to sales@restntravel.shop
    console.log('Order email would be sent:', orderDetails);
}

function sendContactEmail(data) {
    // This would normally send an email to sales@restntravel.shop
    console.log('Contact email would be sent:', data);
}

// Utility functions
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const cartModal = document.getElementById('cart-modal');
    const userModal = document.getElementById('user-modal');
    
    if (e.target === cartModal) {
        cartModal.classList.add('hidden');
    }
    if (e.target === userModal) {
        userModal.classList.add('hidden');
    }
}); 