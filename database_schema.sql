-- Database Schema for RestNTravel on Hostinger
-- Run this SQL in your Hostinger MySQL database

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pin_code VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cod', 'upi', 'online') DEFAULT 'cod',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Products table (for reference)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products (matching your productsData.ts)
INSERT INTO products (id, name, category, price, image, description) VALUES
('1', '7 x 7" Jute/Cotton Cover Square Pillow', 'pillows', 100.00, 'IMG_3572.JPG', 'For Neck Rest. 150gms. Jute/Cotton Cover Square Pillow.'),
('2', '7 x 12" Jute/Cotton Cover Round Pillow', 'pillows', 200.00, 'neck round.png', 'For Neck Rest. 250gms. Jute/Cotton Cover Round Pillow.'),
('3', '10 x 10" Jute/Cotton Cover Square Pillow', 'pillows', 150.00, 'IMG_3577.JPG', 'For Back Rest & Seating. 300gms. Jute/Cotton Cover Square Pillow.'),
('4', '14 x 14" Jute/Cotton Cover Square Pillow', 'pillows', 200.00, 'IMG_5830.JPG', 'For Back Rest & Seating. 450gms. Jute/Cotton Cover Square Pillow.'),
('5', '20 x 26" Jute/Cotton Triangular Pillow', 'pillows', 300.00, 'triangle.png', 'For Back Rest & Seating. 750gms. Jute/Cotton Triangular Pillow.'),
('6', '14 x 22 " Jute/Cotton Cover Rectangular Pillow', 'pillows', 250.00, 'IMG_5823.JPG', 'For Sleeping. 750gms. Jute/Cotton Cover Rectangular Pillow.'),
('7', '16 x 22" Jute/Cotton Cover Rectangular Pillow', 'pillows', 300.00, 'IMG_5824.JPG', 'For Sleeping. 850gms. Jute/Cotton Cover Rectangular Pillow.'),
('8', '16 x 27" Jute/Cotton Cover Rectangular Pillow', 'pillows', 350.00, 'IMG_5826.JPG', 'For Sleeping. 1000gms. Jute/Cotton Cover Rectangular Pillow.'),
('9', 'Single Mattress 5\'x2.5\'', 'mattresses', 1500.00, 'IMG_5812.JPG', 'Single Mattress. 5\'x2.5\'.'),
('10', 'Double Mattress 6\'x5\'', 'mattresses', 2000.00, 'IMG_5817.JPG', 'Double Mattress. 6\'x5\'.'),
('11', 'Single Quilt 5\'x2.5\'', 'quilts', 1500.00, 'qui 1.png', 'Single Quilt. 5\'x2.5\'.'),
('12', 'Double Quilt 6\'x5\'', 'quilts', 2000.00, 'qui 2.png', 'Double Quilt. 6\'x5\'.'),
('13', 'Bean Bag 5\'x4\' (Patterned)', 'beanbags', 1500.00, 'IMG_5815.JPG', 'Bean Bag. 5\'x4\'. Patterned.'),
('14', 'Bean Bag 5\'x4\' (Plain)', 'beanbags', 1500.00, 'IMG_5815.JPG', 'Bean Bag. 5\'x4\'. Plain.');

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_users_email ON users(email); 