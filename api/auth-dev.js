// Development Authentication API
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent user storage file
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load users from file or initialize with admin user
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  
  // Initialize with admin user if no users exist
  const adminUser = {
    id: 1,
    name: 'Admin',
    email: 'sales@restntravel.shop',
    password: '$2a$10$lXxwk9keGgiIhMxNJsiIuOT6DEcKRkovt./0sW0I/B0zytWbKyPuq', // "SalesRNT@8912" hashed
    role: 'admin',
    created_at: new Date().toISOString()
  };
  
  saveUsers([adminUser]);
  return [adminUser];
};

// Save users to file
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Initialize users array
let users = loadUsers();

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { action, email, password, name } = req.body;

  if (action === 'login') {
    try {
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        }, 
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
        message: 'Login failed' 
      });
    }
  }

  if (action === 'signup') {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Generate token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        }, 
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
        message: 'Registration failed' 
      });
    }
  }

  return res.status(400).json({ 
    success: false, 
    message: 'Invalid action' 
  });
}

// Export users for admin panel
export const getUsers = () => users.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at
}));

// Verify admin token
export const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    return user && user.role === 'admin' ? user : null;
  } catch (error) {
    return null;
  }
}; 