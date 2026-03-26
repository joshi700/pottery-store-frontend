import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import { Package, Eye, Loader2, ShoppingBag, Truck, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  received: { label: 'Received', color: 'bg-blue-100 text-blue-800', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const PAYMENT_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600' },
  paid: { label: 'Paid', color: 'text-green-600' },
  failed: { label: 'Failed', color: 'text-red-600' },
  refunded: { label: 'Refunded', color: 'text-blue-600' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const viewOrderDetail = async (orderId) => {
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(null);
      return;
    }
    setDetailLoading(true);
    try {
      const res = await ordersAPI.getById(orderId);
      setSelectedOrder(res.data.order);
    } catch (err) {
      console.error('Failed to fetch order detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.received;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon size={14} /> {config.label}
      </span>
    );
  };

  const OrderTimeline = ({ statusHistory }) => {
    if (!statusHistory?.length) return null;
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-pottery-800 mb-3">Status History</h4>
        <div className="space-y-3">
          {statusHistory.map((entry, i) => {
            const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.received;
            const Icon = config.icon;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                    <Icon size={14} />
                  </div>
                  {i < statusHistory.length - 1 && <div className="w-0.5 h-full bg-pottery-200 mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="font-medium text-pottery-800 text-sm">{config.label}</p>
                  <p className="text-xs text-pottery-500">
                    {new Date(entry.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {entry.note && <p className="text-xs text-pottery-600 mt-1">{entry.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <Loader2 size={48} className="mx-auto text-pottery-600 animate-spin mb-4" />
        <p className="text-pottery-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-pottery-400 mb-4" />
        <h2 className="text-2xl font-display font-bold text-pottery-800 mb-2">No orders yet</h2>
        <p className="text-pottery-600 mb-6">Start exploring our handcrafted pottery collection.</p>
        <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold text-pottery-800 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="card fade-in">
            {/* Order Header */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div>
                    <p className="text-sm text-pottery-500">Order</p>
                    <p className="font-bold text-pottery-800">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-pottery-500">Date</p>
                    <p className="text-pottery-800 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-pottery-500">Total</p>
                    <p className="font-semibold text-pottery-800">₹{order.total?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.orderStatus} />
                  <span className={`text-xs font-medium ${PAYMENT_CONFIG[order.paymentStatus]?.color || 'text-pottery-600'}`}>
                    {PAYMENT_CONFIG[order.paymentStatus]?.label || order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex flex-wrap gap-3 mb-4">
                {order.items?.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-pottery-50 rounded-lg p-2 pr-4">
                    <img
                      src={item.image || item.product?.images?.[0] || ''}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-pottery-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-pottery-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <span className="text-sm text-pottery-500 self-center">
                    +{order.items.length - 4} more
                  </span>
                )}
              </div>

              {/* Shipping tracker for shipped orders */}
              {order.orderStatus === 'shipped' && order.trackingNumber && (
                <div className="bg-purple-50 p-3 rounded-lg mb-4 flex items-center gap-3">
                  <Truck size={20} className="text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Shipped</p>
                    <p className="text-xs text-purple-600">
                      Tracking: {order.trackingNumber}
                      {order.shippingCarrier && ` via ${order.shippingCarrier}`}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => viewOrderDetail(order._id)}
                className="text-pottery-600 hover:text-pottery-800 text-sm font-medium flex items-center gap-1 transition"
              >
                <Eye size={16} />
                {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {/* Expanded Detail */}
            {selectedOrder?._id === order._id && (
              <div className="border-t border-pottery-200 p-4 sm:p-6 bg-pottery-50 fade-in">
                {detailLoading ? (
                  <div className="text-center py-4">
                    <Loader2 size={24} className="mx-auto text-pottery-600 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items Detail */}
                    <div>
                      <h4 className="text-sm font-semibold text-pottery-800 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {selectedOrder.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-pottery-700">
                              {item.name} <span className="text-pottery-500">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-pottery-800">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-pottery-200 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-pottery-600">Subtotal</span>
                            <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-pottery-600">Shipping</span>
                            <span>{selectedOrder.shippingCost === 0 ? 'FREE' : `₹${selectedOrder.shippingCost}`}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{selectedOrder.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addresses & Timeline */}
                    <div>
                      <h4 className="text-sm font-semibold text-pottery-800 mb-2">Shipping Address</h4>
                      <div className="text-sm text-pottery-700 mb-4">
                        <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                        <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                        {selectedOrder.shippingAddress?.addressLine2 && (
                          <p>{selectedOrder.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                          {selectedOrder.shippingAddress?.pincode}
                        </p>
                      </div>

                      <OrderTimeline statusHistory={selectedOrder.statusHistory} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
