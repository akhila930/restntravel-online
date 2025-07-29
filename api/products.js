// Vercel API function for products
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Import your products data
    const products = [
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

    return res.status(200).json({
      success: true,
      products: products.filter(p => p.is_active)
    });

  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load products'
    });
  }
} 