// Database configuration for Hostinger MySQL
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_db_username',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME || 'restntravel_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
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
    `);

    // Create products table
    await connection.execute(`
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
    `);

    // Create orders table
    await connection.execute(`
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
    `);

    // Create testimonials table
    await connection.execute(`
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
    `);

    // Insert default admin user if not exists
    const [adminUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['sales@restntravel.shop']
    );

    if (adminUsers.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('SalesRNT@8912', 10);
      
      await connection.execute(`
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
      `, ['Admin', 'sales@restntravel.shop', hashedPassword, 'admin']);
      
      console.log('✅ Default admin user created');
    }

    // Insert default products if not exists
    const [products] = await connection.execute('SELECT * FROM products');
    
    if (products.length === 0) {
      const defaultProducts = [
        ['Organic Cotton T-Shirt', 'Clothing', 29.99, '/Products/tshirt.jpg', 'Comfortable organic cotton t-shirt', 0],
        ['Bamboo Water Bottle', 'Accessories', 24.99, '/Products/bottle.jpg', 'Eco-friendly bamboo water bottle', 0],
        ['Hemp Backpack', 'Bags', 49.99, '/Products/backpack.jpg', 'Sustainable hemp backpack', 0],
        ['Recycled Paper Notebook', 'Stationery', 12.99, '/Products/notebook.jpg', '100% recycled paper notebook', 0],
        ['Organic Soap Bar', 'Personal Care', 8.99, '/Products/soap.jpg', 'Natural organic soap bar', 0],
        ['Bamboo Toothbrush', 'Personal Care', 6.99, '/Products/toothbrush.jpg', 'Biodegradable bamboo toothbrush', 0]
      ];

      for (const product of defaultProducts) {
        await connection.execute(`
          INSERT INTO products (name, category, price, image, description, delivery_charges)
          VALUES (?, ?, ?, ?, ?, ?)
        `, product);
      }
      
      console.log('✅ Default products created');
    }

    // Insert default testimonials if not exists
    const [testimonials] = await connection.execute('SELECT * FROM testimonials');
    
    if (testimonials.length === 0) {
      const defaultTestimonials = [
        ['Sarah Johnson', 5, 'Amazing quality products! The organic cotton t-shirt is so comfortable and the bamboo water bottle keeps my drinks cold for hours. Highly recommend RestNTravel!', '/testimonials/sarah.jpg', 'Clothing'],
        ['Michael Chen', 5, 'Great customer service and fast delivery. The hemp backpack is perfect for my daily commute. Love supporting eco-friendly brands!', '/testimonials/michael.jpg', 'Bags'],
        ['Emily Rodriguez', 4, 'The recycled paper notebook is exactly what I needed for my studies. Good quality and environmentally conscious. Will definitely buy more!', '/testimonials/emily.jpg', 'Stationery'],
        ['David Thompson', 5, 'Switched to the bamboo toothbrush and organic soap. My teeth feel cleaner and my skin is healthier. Great sustainable alternatives!', '/testimonials/david.jpg', 'Personal Care']
      ];

      for (const testimonial of defaultTestimonials) {
        await connection.execute(`
          INSERT INTO testimonials (name, rating, comment, image, product)
          VALUES (?, ?, ?, ?, ?)
        `, testimonial);
      }
      
      console.log('✅ Default testimonials created');
    }

    connection.release();
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

export default pool; 