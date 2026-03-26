import { useState, useEffect } from 'react';
import { ordersAPI } from '../../utils/api';
import {
  Package, Loader2, Filter, ChevronLeft, ChevronRight,
  Clock, CheckCircle, Truck, XCircle, Eye, X, MapPin
} from 'lucide-react';

const STATUS_CONFIG = {
  received: { label: 'Received', color: 'bg-blue-100 text-blue-800', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const STATUS_FLOW = ['received', 'in_progress', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      if (filterPayment) params.paymentStatus = filterPayment;
      const res = await ordersAPI.getAll(params);
      setOrders(res.data.orders);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, filterStatus, filterPayment]);

  const openOrderDetail = async (orderId) => {
    setDetailLoading(true);
    try {
      const res = await ordersAPI.getById(orderId);
      setSelectedOrder(res.data.order);
      setStatusNote('');
      setTrackingNumber('');
      setShippingCarrier('');
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const data = { status: newStatus, note: statusNote };
      if (newStatus === 'shipped' && trackingNumber) {
        data.note = `${statusNote ? statusNote + '. ' : ''}Tracking: ${trackingNumber}${shippingCarrier ? ` via ${shippingCarrier}` : ''}`;
        data.trackingNumber = trackingNumber;
        data.shippingCarrier = shippingCarrier;
      }
      await ordersAPI.updateStatus(selectedOrder._id, data);
      await openOrderDetail(selectedOrder._id);
      await fetchOrders();
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.received;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon size={12} /> {config.label}
      </span>
    );
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display font-bold text-pottery-800 mb-6">Manage Orders</h1>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center">
        <Filter size={18} className="text-pottery-600" />
        <select className="input max-w-[200px]" value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select className="input max-w-[200px]" value={filterPayment}
          onChange={e => { setFilterPayment(e.target.value); setPage(1); }}>
          <option value="">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 size={48} className="mx-auto text-pottery-600 animate-spin mb-4" />
          <p className="text-pottery-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={48} className="mx-auto text-pottery-400 mb-4" />
          <p className="text-pottery-600">No orders found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pottery-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Items</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-pottery-600 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-t border-pottery-100 hover:bg-pottery-50 transition">
                      <td className="py-3 px-4 font-medium text-pottery-800">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="text-pottery-800">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-pottery-500">{order.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-pottery-700">{order.items?.length} items</td>
                      <td className="py-3 px-4 font-semibold text-pottery-800">₹{order.total?.toLocaleString()}</td>
                      <td className="py-3 px-4"><StatusBadge status={order.orderStatus} /></td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-pottery-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => openOrderDetail(order._id)}
                          className="text-pottery-600 hover:text-pottery-800 p-1">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn btn-secondary text-sm flex items-center gap-1 disabled:opacity-50">
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-sm text-pottery-600">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="btn btn-secondary text-sm flex items-center gap-1 disabled:opacity-50">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Slide-over */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-pottery-800">
                  Order {selectedOrder.orderNumber}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-pottery-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-pottery-600 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Customer */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-pottery-600 mb-2">CUSTOMER</h3>
                    <p className="font-medium text-pottery-800">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-pottery-600">{selectedOrder.user?.email}</p>
                    <p className="text-sm text-pottery-600">{selectedOrder.user?.phone}</p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-pottery-600 mb-2">ITEMS</h3>
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-pottery-100 text-sm">
                        <div className="flex gap-3 items-center">
                          <img src={item.image || item.product?.images?.[0] || ''}
                            alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <p className="text-pottery-800">{item.name}</p>
                            <p className="text-pottery-500">x{item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-pottery-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="pt-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-pottery-600">Subtotal</span>
                        <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-pottery-600">Shipping</span>
                        <span>{selectedOrder.shippingCost === 0 ? 'FREE' : `₹${selectedOrder.shippingCost}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-pottery-200 pt-2">
                        <span>Total</span><span>₹{selectedOrder.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-pottery-600 mb-2 flex items-center gap-1">
                        <MapPin size={14} /> SHIPPING
                      </h3>
                      <div className="text-sm text-pottery-700">
                        <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                        <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                        {selectedOrder.shippingAddress?.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                        <p>{selectedOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-pottery-600 mb-2">BILLING</h3>
                      <div className="text-sm text-pottery-700">
                        <p className="font-medium">{selectedOrder.billingAddress?.fullName}</p>
                        <p>{selectedOrder.billingAddress?.addressLine1}</p>
                        {selectedOrder.billingAddress?.addressLine2 && <p>{selectedOrder.billingAddress.addressLine2}</p>}
                        <p>{selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state} - {selectedOrder.billingAddress?.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="bg-pottery-50 p-4 rounded-lg mb-6">
                    <h3 className="text-sm font-semibold text-pottery-600 mb-3">UPDATE STATUS</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-pottery-600">Current:</span>
                      <StatusBadge status={selectedOrder.orderStatus} />
                    </div>

                    {selectedOrder.orderStatus === 'in_progress' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input type="text" className="input text-sm" placeholder="Tracking number"
                          value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                        <input type="text" className="input text-sm" placeholder="Carrier (e.g., Delhivery)"
                          value={shippingCarrier} onChange={e => setShippingCarrier(e.target.value)} />
                      </div>
                    )}

                    <input type="text" className="input text-sm mb-3" placeholder="Add a note (optional)"
                      value={statusNote} onChange={e => setStatusNote(e.target.value)} />

                    <div className="flex flex-wrap gap-2">
                      {STATUS_FLOW.filter(s => s !== selectedOrder.orderStatus).map(status => (
                        <button key={status} onClick={() => updateOrderStatus(status)}
                          disabled={updatingStatus}
                          className="btn btn-secondary text-xs py-2 px-3 disabled:opacity-50">
                          {updatingStatus ? 'Updating...' : `Mark ${STATUS_CONFIG[status].label}`}
                        </button>
                      ))}
                      {selectedOrder.orderStatus !== 'cancelled' && (
                        <button onClick={() => updateOrderStatus('cancelled')}
                          disabled={updatingStatus}
                          className="btn text-xs py-2 px-3 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status History */}
                  {selectedOrder.statusHistory?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-pottery-600 mb-3">STATUS HISTORY</h3>
                      <div className="space-y-2">
                        {selectedOrder.statusHistory.map((entry, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              STATUS_CONFIG[entry.status] ? STATUS_CONFIG[entry.status].color.split(' ')[0] : 'bg-gray-400'
                            }`} />
                            <div>
                              <p className="text-pottery-800 font-medium">
                                {STATUS_CONFIG[entry.status]?.label || entry.status}
                              </p>
                              <p className="text-xs text-pottery-500">
                                {new Date(entry.updatedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                              {entry.note && <p className="text-xs text-pottery-600">{entry.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
