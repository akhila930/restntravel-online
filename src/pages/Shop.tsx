
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Filter, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  is_active: boolean;
  delivery_charges?: number;
}

const Shop = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'pillows', name: 'Pillows' },
    { id: 'mattresses', name: 'Mattresses' },
    { id: 'quilts', name: 'Quilts' },
    { id: 'beanbags', name: 'Bean Bags' }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin?action=products');
        const data = await response.json();
        
        if (data.success) {
          // Only show active products on the shop page
          const activeProducts = data.products.filter((product: Product) => product.is_active);
          setProducts(activeProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">Discover our range of organic comfort products</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-700 font-medium">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'hover:bg-green-50 border-green-600 text-green-600'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-4">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={`/Products/${product.image}?v=${Date.now()}`}
                    alt={product.name}
                    className="w-full h-48 object-contain bg-white rounded-lg mb-4 p-2 border"
                    onError={(e) => {
                      // Try alternative paths if the main path fails
                      const img = e.currentTarget;
                      if (!img.dataset.fallback1) {
                        img.dataset.fallback1 = 'true';
                        img.src = `/Products/${product.image.toLowerCase()}?v=${Date.now()}`;
                      } else if (!img.dataset.fallback2) {
                        img.dataset.fallback2 = 'true';
                        img.src = `/Products/${product.image.replace(/\.[^/.]+$/, '.jpg')}?v=${Date.now()}`;
                      } else if (!img.dataset.fallback3) {
                        img.dataset.fallback3 = 'true';
                        img.src = `/Products/${product.image.replace(/\.[^/.]+$/, '.png')}?v=${Date.now()}`;
                      } else {
                        // Final fallback to placeholder
                        img.src = '/placeholder.svg';
                      }
                    }}
                  />
                </Link>
                <Badge className="mb-2 bg-green-100 text-green-700 hover:bg-green-100">
                  {categories.find(cat => cat.id === product.category)?.name}
                </Badge>
                <h3 className="font-semibold text-lg mb-2">
                  <Link to={`/product/${product.id}`} className="hover:text-green-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                  <Button
                    size="sm"
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: `/Products/${product.image}`,
                      delivery_charges: product.delivery_charges
                    })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  {product.delivery_charges && product.delivery_charges > 0 ? (
                    <span>Delivery: ₹{product.delivery_charges}</span>
                  ) : (
                    <span className="text-green-600">Free Delivery</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
