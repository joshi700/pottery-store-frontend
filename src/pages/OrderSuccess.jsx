import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import {
  CheckCircle, Package, MapPin, ArrowRight, Loader2, XCircle,
  Printer, CreditCard, Calendar, Hash
} from 'lucide-react';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = searchParams.get('orderId');
        if (!orderId) {
          setError('No order information found.');
          setLoading(false);
          return;
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
        <p className="text-pottery-600">Loading your receipt...</p>
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
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="container-custom py-8 max-w-3xl mx-auto">
      {/* Success Banner */}
      <div className="text-center mb-8 fade-in">
        {isPaid ? (
          <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
        ) : (
          <Package size={72} className="mx-auto text-yellow-500 mb-4" />
        )}
        <h1 className="text-3xl font-display font-bold text-pottery-800 mb-2">
          {isPaid ? 'Payment Successful!' : 'Order Created'}
        </h1>
        <p className="text-pottery-600">
          {isPaid
            ? 'Thank you for your purchase. Your handcrafted pottery is being prepared with care.'
            : 'Your order is awaiting payment confirmation.'}
        </p>
      </div>

      {/* Receipt Card */}
      <div id="receipt" className="card p-8 mb-6 fade-in">
        {/* Receipt Header */}
        <div className="text-center border-b border-pottery-200 pb-6 mb-6">
          <h2 className="text-2xl font-display font-bold text-pottery-800">Meenakshi Pottery</h2>
          <p className="text-sm text-pottery-500 mt-1">Handcrafted Ceramics</p>
          <div className="mt-4 inline-block bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            {isPaid ? 'PAID' : order.paymentStatus?.toUpperCase()}
          </div>
        </div>

        {/* Order Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div className="flex items-start gap-2">
            <Hash size={16} className="text-pottery-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-pottery-500">Order No.</p>
              <p className="font-semibold text-pottery-800">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-pottery-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-pottery-500">Date</p>
              <p className="font-semibold text-pottery-800">{orderDate}</p>
              <p className="text-xs text-pottery-500">{orderTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard size={16} className="text-pottery-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-pottery-500">Payment</p>
              <p className="font-semibold text-pottery-800">Google Pay</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package size={16} className="text-pottery-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-pottery-500">Status</p>
              <p className="font-semibold text-pottery-800 capitalize">{order.orderStatus?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="font-semibold text-pottery-800 mb-3 text-sm uppercase tracking-wide">Items</h3>
          <div className="border border-pottery-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-pottery-50">
                <tr>
                  <th className="text-left py-3 px-4 text-pottery-600 font-medium">Product</th>
                  <th className="text-center py-3 px-4 text-pottery-600 font-medium">Qty</th>
                  <th className="text-right py-3 px-4 text-pottery-600 font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-pottery-600 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pottery-100">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || item.product?.images?.[0] || ''}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded print:hidden"
                        />
                        <span className="font-medium text-pottery-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-pottery-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-pottery-700">${item.price?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-pottery-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-pottery-200 pt-4 mb-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-pottery-600">Subtotal</span>
                <span className="text-pottery-800">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pottery-600">Shipping</span>
                <span className={order.shippingCost === 0 ? 'text-green-600 font-medium' : 'text-pottery-800'}>
                  {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-pottery-300 pt-2">
                <span className="text-pottery-800">Total</span>
                <span className="text-pottery-800">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-pottery-200 pt-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-pottery-500" />
              <h4 className="font-semibold text-pottery-800 text-sm uppercase tracking-wide">Shipping Address</h4>
            </div>
            <div className="text-sm text-pottery-700 space-y-0.5">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            </div>
          </div>
          {order.billingAddress && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-pottery-500" />
                <h4 className="font-semibold text-pottery-800 text-sm uppercase tracking-wide">Billing Address</h4>
              </div>
              <div className="text-sm text-pottery-700 space-y-0.5">
                <p className="font-medium">{order.billingAddress?.fullName}</p>
                <p>{order.billingAddress?.phone}</p>
                <p>{order.billingAddress?.addressLine1}</p>
                {order.billingAddress?.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                <p>{order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.zipCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Receipt Footer */}
        <div className="text-center border-t border-pottery-200 mt-6 pt-6">
          <p className="text-xs text-pottery-400">
            Thank you for shopping with Meenakshi Pottery.
          </p>
          <p className="text-xs text-pottery-400 mt-1">
            Questions? Contact us at support@joshig.in
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
        <button
          onClick={() => window.print()}
          className="btn btn-secondary flex items-center justify-center gap-2 print:hidden"
        >
          <Printer size={18} /> Print Receipt
        </button>
        <Link to="/my-orders" className="btn btn-primary flex items-center justify-center gap-2 print:hidden">
          <Package size={18} /> View My Orders
        </Link>
        <Link to="/shop" className="btn btn-outline flex items-center justify-center gap-2 print:hidden">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
