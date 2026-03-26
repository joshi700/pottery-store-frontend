import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ordersAPI, paymentAPI } from '../utils/api';
import { CheckCircle, Package, MapPin, ArrowRight, Loader2, XCircle } from 'lucide-react';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try orderId from URL params first, then from sessionStorage (hosted checkout redirect)
        let orderId = searchParams.get('orderId');
        const resultIndicator = searchParams.get('resultIndicator');

        if (!orderId) {
          const pending = sessionStorage.getItem('pendingOrder');
          if (pending) {
            const parsed = JSON.parse(pending);
            orderId = parsed.orderId;
            sessionStorage.removeItem('pendingOrder');
          }
        }

        if (!orderId) {
          setError('No order information found.');
          setLoading(false);
          return;
        }

        // If returning from Mastercard Hosted Checkout, verify payment first
        if (resultIndicator) {
          try {
            await paymentAPI.verifyPayment({ orderId, resultIndicator });
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
          }
        }

        const res = await ordersAPI.getById(orderId);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <Loader2 size={48} className="mx-auto text-pottery-600 animate-spin mb-4" />
        <p className="text-pottery-600">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-custom py-16 text-center">
        <XCircle size={64} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-display font-bold text-pottery-800 mb-2">
          {error || 'Order not found'}
        </h2>
        <p className="text-pottery-600 mb-6">Please check your orders page for updates.</p>
        <Link to="/my-orders" className="btn btn-primary">View My Orders</Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="container-custom py-8 max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8 fade-in">
        {isPaid ? (
          <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
        ) : (
          <Package size={72} className="mx-auto text-yellow-500 mb-4" />
        )}
        <h1 className="text-3xl font-display font-bold text-pottery-800 mb-2">
          {isPaid ? 'Order Placed Successfully!' : 'Order Created'}
        </h1>
        <p className="text-pottery-600">
          {isPaid
            ? 'Thank you for your purchase. Your handcrafted pottery is being prepared with care.'
            : 'Your order is awaiting payment confirmation.'}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="card p-6 mb-6 fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-pottery-200">
          <div>
            <p className="text-sm text-pottery-500">Order Number</p>
            <p className="text-xl font-bold text-pottery-800">{order.orderNumber}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-pottery-500">Order Date</p>
            <p className="text-pottery-800 font-medium">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <h3 className="font-semibold text-pottery-800 mb-3">Items Ordered</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 p-3 bg-pottery-50 rounded-lg">
              <img
                src={item.image || item.product?.images?.[0] || ''}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-pottery-800">{item.name}</p>
                <p className="text-sm text-pottery-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-pottery-800">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-pottery-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-pottery-600">Subtotal</span>
            <span className="text-pottery-800">₹{order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pottery-600">Shipping</span>
            <span className={order.shippingCost === 0 ? 'text-green-600 font-medium' : 'text-pottery-800'}>
              {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-pottery-200 pt-2">
            <span className="text-pottery-800">Total</span>
            <span className="text-pottery-800">₹{order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card p-6 mb-6 fade-in">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-pottery-600" size={20} />
          <h3 className="font-semibold text-pottery-800">Shipping Address</h3>
        </div>
        <div className="text-sm text-pottery-700">
          <p className="font-medium">{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.phone}</p>
          <p>{order.shippingAddress?.addressLine1}</p>
          {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
        </div>
      </div>

      {/* Status */}
      <div className="card p-6 mb-8 fade-in">
        <h3 className="font-semibold text-pottery-800 mb-3">Order Status</h3>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isPaid ? 'bg-green-500' : order.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <div>
            <p className="font-medium text-pottery-800 capitalize">
              {order.orderStatus?.replace('_', ' ')}
            </p>
            <p className="text-sm text-pottery-600">
              Payment: <span className="capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
        <Link to="/my-orders" className="btn btn-primary flex items-center justify-center gap-2">
          <Package size={18} /> View My Orders
        </Link>
        <Link to="/shop" className="btn btn-outline flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
