// Vercel API function for authentication
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Mock users data (in production, this would be in a database)
const users = [
  {
    id: 1,
    name: 'Admin',
    email: 'sales@restntravel.shop',
    password: '$2a$10$lXxwk9keGgiIhMxNJsiIuOT6DEcKRkovt./0sW0I/B0zytWbKyPuq', // "SalesRNT@8912" hashed
    role: 'admin',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Test Customer',
    email: 'customer@example.com',
    password: '$2a$10$lXxwk9keGgiIhMxNJsiIuOT6DEcKRkovt./0sW0I/B0zytWbKyPuq', // "password123" hashed
    role: 'customer',
    created_at: '2024-01-01T00:00:00.000Z'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { action, email, password, name } = req.body;

  if (action === 'login') {
    try {
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }

  if (action === 'signup') {
    try {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        created_at: new Date().toISOString()
      };

      users.push(newUser);

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      });

    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  }

  return res.status(400).json({ success: false, message: 'Invalid action' });
} 