<?php
// Database configuration for Hostinger MySQL
class Database {
    private $host = 'localhost';
    private $db_name = 'u897731037_restntravel_db';
    private $username = 'u897731037_restntravel_us';
    private $password = 'SalesRNT@8912'; // Fixed password
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // Don't echo here - let the calling function handle the error
            error_log("Database connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }

    public function testConnection() {
        try {
            $conn = $this->getConnection();
            if ($conn) {
                return true;
            }
        } catch(PDOException $exception) {
            error_log("Database connection failed: " . $exception->getMessage());
            return false;
        }
    }

    public function initializeDatabase() {
        try {
            $conn = $this->getConnection();
            if (!$conn) {
                return false;
            }
            
            // Create users table
            $conn->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'customer') DEFAULT 'customer',
                    phone VARCHAR(20),
                    address TEXT,
                    city VARCHAR(100),
                    state VARCHAR(100),
                    pin_code VARCHAR(10),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");

            // Create products table
            $conn->exec("
                CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    image VARCHAR(500),
                    description TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    delivery_charges DECIMAL(10,2) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");

            // Create orders table
            $conn->exec("
                CREATE TABLE IF NOT EXISTS orders (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_number VARCHAR(50) UNIQUE NOT NULL,
                    user_id INT,
                    customer_name VARCHAR(255) NOT NULL,
                    customer_email VARCHAR(255) NOT NULL,
                    customer_phone VARCHAR(20),
                    total_amount DECIMAL(10,2) NOT NULL,
                    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                    shipping_address TEXT,
                    shipping_city VARCHAR(100),
                    shipping_state VARCHAR(100),
                    shipping_pin_code VARCHAR(10),
                    payment_method VARCHAR(50),
                    items_summary TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                )
            ");

            // Create testimonials table
            $conn->exec("
                CREATE TABLE IF NOT EXISTS testimonials (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT NOT NULL,
                    image VARCHAR(500),
                    video VARCHAR(500),
                    product VARCHAR(100),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");

            // Insert default admin user if not exists
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute(['sales@restntravel.shop']);
            
            if ($stmt->rowCount() == 0) {
                $hashedPassword = password_hash('SalesRNT@8912', PASSWORD_DEFAULT);
                $stmt = $conn->prepare("
                    INSERT INTO users (name, email, password, role) 
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute(['Admin', 'sales@restntravel.shop', $hashedPassword, 'admin']);
            }

            // Insert default products if not exists
            $stmt = $conn->prepare("SELECT * FROM products");
            $stmt->execute();
            
            if ($stmt->rowCount() == 0) {
                $defaultProducts = [
                    ['Organic Cotton T-Shirt', 'Clothing', 29.99, '/Products/tshirt.jpg', 'Comfortable organic cotton t-shirt', 0],
                    ['Bamboo Water Bottle', 'Accessories', 24.99, '/Products/bottle.jpg', 'Eco-friendly bamboo water bottle', 0],
                    ['Hemp Backpack', 'Bags', 49.99, '/Products/backpack.jpg', 'Sustainable hemp backpack', 0],
                    ['Recycled Paper Notebook', 'Stationery', 12.99, '/Products/notebook.jpg', '100% recycled paper notebook', 0],
                    ['Organic Soap Bar', 'Personal Care', 8.99, '/Products/soap.jpg', 'Natural organic soap bar', 0],
                    ['Bamboo Toothbrush', 'Personal Care', 6.99, '/Products/toothbrush.jpg', 'Biodegradable bamboo toothbrush', 0]
                ];

                $stmt = $conn->prepare("
                    INSERT INTO products (name, category, price, image, description, delivery_charges)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");

                foreach ($defaultProducts as $product) {
                    $stmt->execute($product);
                }
            }

            // Insert default testimonials if not exists
            $stmt = $conn->prepare("SELECT * FROM testimonials");
            $stmt->execute();
            
            if ($stmt->rowCount() == 0) {
                $defaultTestimonials = [
                    ['Sarah Johnson', 5, 'Amazing quality products! The organic cotton t-shirt is so comfortable and the bamboo water bottle keeps my drinks cold for hours. Highly recommend RestNTravel!', '/testimonials/sarah.jpg', 'Clothing'],
                    ['Michael Chen', 5, 'Great customer service and fast delivery. The hemp backpack is perfect for my daily commute. Love supporting eco-friendly brands!', '/testimonials/michael.jpg', 'Bags'],
                    ['Emily Rodriguez', 4, 'The recycled paper notebook is exactly what I needed for my studies. Good quality and environmentally conscious. Will definitely buy more!', '/testimonials/emily.jpg', 'Stationery'],
                    ['David Thompson', 5, 'Switched to the bamboo toothbrush and organic soap. My teeth feel cleaner and my skin is healthier. Great sustainable alternatives!', '/testimonials/david.jpg', 'Personal Care']
                ];

                $stmt = $conn->prepare("
                    INSERT INTO testimonials (name, rating, comment, image, product)
                    VALUES (?, ?, ?, ?, ?)
                ");

                foreach ($defaultTestimonials as $testimonial) {
                    $stmt->execute($testimonial);
                }
            }

            return true;
        } catch(PDOException $exception) {
            error_log("Database initialization failed: " . $exception->getMessage());
            return false;
        }
    }
}
?> 