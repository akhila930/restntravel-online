
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Star, Truck, Shield, Leaf, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  is_active: boolean;
  delivery_charges?: number;
  features?: string[];
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  rating?: number;
  reviews?: number;
}

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin?action=products');
        const data = await response.json();
        
        if (data.success) {
          const foundProduct = data.products.find((p: Product) => p.id === id);
          if (foundProduct && foundProduct.is_active) {
            setProduct(foundProduct);
          } else {
            setError('Product not found or inactive');
          }
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Provide fallback/defaults for missing fields
  const features = product.features || ['Handcrafted', 'Eco-friendly', 'Natural fibers'];
  const dimensions = product.dimensions || 'See product description';
  const weight = product.weight || 'See product description';
  const careInstructions = product.careInstructions || 'Gentle hand wash recommended.';
  const rating = product.rating || 5;
  const reviews = product.reviews || 12;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `/Products/${product.image}`,
        delivery_charges: product.delivery_charges
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/shop" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={`/Products/${product.image}?v=${Date.now()}`}
                alt={product.name}
                className="w-full h-full object-contain bg-white rounded-lg p-4 border"
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
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-green-100 text-green-700">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-4">₹{product.price}</p>
              <div className="text-sm text-gray-600 mb-4">
                {product.delivery_charges && product.delivery_charges > 0 ? (
                  <span>Delivery: ₹{product.delivery_charges}</span>
                ) : (
                  <span className="text-green-600">Free Delivery</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Dimensions</h4>
                <p className="text-gray-600">{dimensions}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Weight</h4>
                <p className="text-gray-600">{weight}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Care Instructions</h4>
              <p className="text-gray-600 text-sm">{careInstructions}</p>
            </div>

            {/* Add to Cart */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Add to Cart - ₹{product.price * quantity}
                </Button>
              </CardContent>
            </Card>

            {/* Product Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Organic</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Safe & Natural</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
