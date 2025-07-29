
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { Minus, Plus, Trash2, ShoppingBag, LogIn, CreditCard, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'qr'
  const [showQRCode, setShowQRCode] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState('/payment-qr-code.png');
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    email: user?.email || ''
  });

  // Load current QR code configuration
  useEffect(() => {
    const loadQRCode = async () => {
      try {
        const response = await fetch('/api/qr-code');
        const data = await response.json();
        if (data.success && data.currentQR) {
          setCurrentQRCode(data.currentQR);
        }
      } catch (error) {
        console.error('Failed to load QR code configuration:', error);
      }
    };
    
    loadQRCode();
  }, []);

  // Calculate delivery charges based on products
  const calculateDeliveryCharges = () => {
    if (items.length === 0) return 0;
    
    // For now, use the highest delivery charge among items
    // In the future, this could be more sophisticated (e.g., based on weight, distance, etc.)
    const maxDeliveryCharge = Math.max(...items.map(item => item.delivery_charges || 0));
    return maxDeliveryCharge;
  };

  const deliveryCharges = calculateDeliveryCharges();
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryCharges;

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    
    // Validate required fields
    if (!billingInfo.name || !billingInfo.street || !billingInfo.city || !billingInfo.state || !billingInfo.pinCode || !billingInfo.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // For QR payment, show QR code first
    if (paymentMethod === 'qr') {
      setShowQRCode(true);
      return;
    }

    // For COD, proceed with order
    await processOrder();
  };

  const processOrder = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          billingInfo,
          items,
          total,
          subtotal,
          deliveryCharges,
          paymentMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.orderNumber);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRPaymentComplete = () => {
    setShowQRCode(false);
    processOrder();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
              {orderNumber && (
                <p className="text-lg font-semibold text-green-600 mb-2">
                  Order #: {orderNumber}
                </p>
              )}
              <p className="text-gray-600 mb-6">
                Thank you for your order. We will contact you soon to confirm your order details. 
                {paymentMethod === 'cod' ? ' Your order will be delivered with Cash on Delivery option.' : ' Payment received via QR code.'}
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>• You will receive a confirmation call within 24 hours</p>
                <p>• Delivery time: 3-7 business days</p>
                <p>• Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'QR Code Payment'}</p>
                <p>• Order confirmation email sent to sales team</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/orders">View My Orders</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          {!isAuthenticated && (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Login to Order
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items in Cart ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        // Try alternative paths if the main path fails
                        const img = e.currentTarget;
                        if (!img.dataset.fallback1) {
                          img.dataset.fallback1 = 'true';
                          img.src = item.image.toLowerCase();
                        } else if (!img.dataset.fallback2) {
                          img.dataset.fallback2 = 'true';
                          img.src = item.image.replace(/\.[^/.]+$/, '.jpg');
                        } else if (!img.dataset.fallback3) {
                          img.dataset.fallback3 = 'true';
                          img.src = item.image.replace(/\.[^/.]+$/, '.png');
                        } else {
                          // Final fallback to placeholder
                          img.src = '/placeholder.svg';
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Billing Form and Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className={deliveryCharges === 0 ? "text-green-600" : "text-gray-600"}>
                      {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">₹{total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Notice */}
            {!isAuthenticated && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Login Required</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Please login to place your order and track your purchases.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600"
                    />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="qr"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600"
                    />
                    <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                      <QrCode className="h-4 w-4" />
                      QR Code Payment
                    </Label>
                  </div>
                </div>

                {paymentMethod === 'qr' && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>QR Code Payment:</strong> Scan the QR code after placing your order to complete the payment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Form */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={billingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="street" className="text-sm font-medium">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      value={billingInfo.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        City *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        State *
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        value={billingInfo.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pinCode" className="text-sm font-medium">
                      PIN Code *
                    </Label>
                    <Input
                      id="pinCode"
                      type="text"
                      value={billingInfo.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      placeholder="PIN Code"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Phone number (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email address"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    disabled={!isAuthenticated || loading}
                  >
                    {loading ? 'Processing...' : `Place Order - ₹${total}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* QR Code Payment Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4 text-center">QR Code Payment</h2>
              <div className="text-center mb-6">
                {/* Amount Display */}
                <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-bold text-2xl">₹{total}</p>
                  <p className="text-green-700 text-sm font-medium">Enter this exact amount in your UPI app</p>
                </div>
                
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Instructions:</strong><br/>
                    1. Scan the QR code below<br/>
                    2. Enter ₹{total} as the payment amount<br/>
                    3. Complete the payment in your UPI app
                  </p>
                </div>
                
                {/* QR Code */}
                <p className="text-gray-600 mb-4">Scan this QR code with your UPI app</p>
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                  <img 
                    src={currentQRCode} 
                    alt="Payment QR Code" 
                    className="w-64 h-64 mx-auto object-contain"
                    onError={(e) => {
                      console.log('QR code failed to load, trying backup path');
                      e.currentTarget.src = '/qr-payment.png';
                    }}
                  />
                </div>
                
                {/* Payment Details */}
                <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>UPI ID:</strong> yespay.smessi13928@yesbankl...</p>
                  <p><strong>Account:</strong> Current account - 0742</p>
                  <p className="text-xs text-gray-500 mt-2">NATURETECH SIMPLEINV</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleQRPaymentComplete}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Payment Complete
                </Button>
                <Button 
                  onClick={() => setShowQRCode(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
