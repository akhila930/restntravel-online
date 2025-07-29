const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { action, email, password, name, phone, address, city, state, pinCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    if (action === 'signup') {
      // Check if user already exists
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Insert new user
      const [result] = await pool.execute(
        'INSERT INTO users (email, password_hash, name, phone, address, city, state, pin_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, name || null, phone || null, address || null, city || null, state || null, pinCode || null]
      );

      const userId = result.insertId;

      // Generate JWT token
      const token = generateToken(userId, email);

      return res.status(200).json({
        success: true,
        user: { id: userId, email, name },
        token
      });

    } else if (action === 'login') {
      // Find user by email
      const [users] = await pool.execute(
        'SELECT id, email, password_hash, name FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken(user.id, user.email);

      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token
      });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 