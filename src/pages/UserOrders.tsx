import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, Truck, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_summary?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pin_code?: string;
}

const UserOrders = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadUserOrders();
    
    // Auto-refresh orders every 30 seconds to get status updates
    const interval = setInterval(loadUserOrders, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const loadUserOrders = async () => {
    try {
      const response = await fetch('/api/admin?action=orders');
      const data = await response.json();
      
      if (data.success) {
        // Filter orders for current user
        const userOrders = data.orders.filter((order: Order) => 
          order.customer_email === user?.email
        );
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <Home className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing Order';
      case 'shipped':
        return 'Order Shipped';
      case 'delivered':
        return 'Order Delivered';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track your RestNTravel orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/shop')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{order.total_amount}</p>
                      <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Status Timeline */}
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">{getStatusText(order.status)}</p>
                        <p className="text-sm text-gray-600">
                          {order.status === 'pending' && 'Your order is being reviewed'}
                          {order.status === 'confirmed' && 'Your order has been confirmed'}
                          {order.status === 'processing' && 'Your order is being prepared'}
                          {order.status === 'shipped' && 'Your order is on its way'}
                          {order.status === 'delivered' && 'Your order has been delivered'}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>
                        <p className="text-gray-600">{order.items_summary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Shipping Address</h4>
                        <p className="text-gray-600">
                          {order.shipping_address}<br />
                          {order.shipping_city}, {order.shipping_state} - {order.shipping_pin_code}
                        </p>
                      </div>
                    </div>

                    {/* Contact Support */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Need help? Contact us at{' '}
                        <a href="mailto:sales@restntravel.shop" className="text-green-600 hover:text-green-700">
                          sales@restntravel.shop
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders; 