// Vercel API function for products with persistent storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load products from file or initialize with defaults
const loadProducts = () => {
  try {
    if (fs.existsSync(productsFile)) {
      const data = fs.readFileSync(productsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  
  // Default products if file doesn't exist
  const defaultProducts = [
    {
      id: "1",
      name: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: 29.99,
      image: "/Products/tshirt.jpg",
      description: "Comfortable organic cotton t-shirt",
      is_active: true,
      delivery_charges: 0
    },
    {
      id: "2", 
      name: "Bamboo Water Bottle",
      category: "Accessories",
      price: 24.99,
      image: "/Products/bottle.jpg",
      description: "Eco-friendly bamboo water bottle",
      is_active: true,
      delivery_charges: 0
    },
    {
      id: "3",
      name: "Hemp Backpack",
      category: "Bags",
      price: 49.99,
      image: "/Products/backpack.jpg", 
      description: "Sustainable hemp backpack",
      is_active: true,
      delivery_charges: 0
    },
    {
      id: "4",
      name: "Recycled Paper Notebook",
      category: "Stationery",
      price: 12.99,
      image: "/Products/notebook.jpg",
      description: "100% recycled paper notebook",
      is_active: true,
      delivery_charges: 0
    },
    {
      id: "5",
      name: "Organic Soap Bar",
      category: "Personal Care",
      price: 8.99,
      image: "/Products/soap.jpg",
      description: "Natural organic soap bar",
      is_active: true,
      delivery_charges: 0
    },
    {
      id: "6",
      name: "Bamboo Toothbrush",
      category: "Personal Care",
      price: 6.99,
      image: "/Products/toothbrush.jpg",
      description: "Biodegradable bamboo toothbrush",
      is_active: true,
      delivery_charges: 0
    }
  ];
  
  saveProducts(defaultProducts);
  return defaultProducts;
};

// Save products to file
const saveProducts = (products) => {
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = loadProducts();
      return res.status(200).json({
        success: true,
        products: products.filter(p => p.is_active)
      });
    } catch (error) {
      console.error('Products GET error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to load products'
      });
    }
  }

  if (req.method === 'POST') {
    const { action, productData } = req.body;
    
    if (action === 'update') {
      try {
        const products = loadProducts();
        const productIndex = products.findIndex(p => p.id === productData.id);
        
        if (productIndex !== -1) {
          products[productIndex] = { ...products[productIndex], ...productData };
          saveProducts(products);
          return res.status(200).json({
            success: true,
            message: 'Product updated successfully'
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Product not found'
          });
        }
      } catch (error) {
        console.error('Product update error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update product'
        });
      }
    }

    if (action === 'add') {
      try {
        const products = loadProducts();
        const newProduct = {
          ...productData,
          id: (products.length + 1).toString(),
          created_at: new Date().toISOString()
        };
        products.push(newProduct);
        saveProducts(products);
        return res.status(201).json({
          success: true,
          message: 'Product added successfully'
        });
      } catch (error) {
        console.error('Product add error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to add product'
        });
      }
    }

    if (action === 'delete') {
      try {
        const products = loadProducts();
        const filteredProducts = products.filter(p => p.id !== productData.id);
        saveProducts(filteredProducts);
        return res.status(200).json({
          success: true,
          message: 'Product deleted successfully'
        });
      } catch (error) {
        console.error('Product delete error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete product'
        });
      }
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
} 