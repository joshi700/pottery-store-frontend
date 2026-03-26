import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, productsAPI } from '../../utils/api';
import {
  Package, DollarSign, ShoppingCart, TrendingUp, Loader2,
  ArrowRight, Clock, CheckCircle, Truck, XCircle, BarChart3
} from 'lucide-react';

const STATUS_COLORS = {
  received: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const STATUS_LABELS = {
  received: 'Received',
  in_progress: 'In Progress',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          ordersAPI.getStats(),
          productsAPI.getAll({ limit: 1 }),
        ]);
        setStats(statsRes.data.stats);
        // Get total product count from the response
        setProductCount(productsRes.data.products?.length || 0);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <Loader2 size={48} className="mx-auto text-pottery-600 animate-spin mb-4" />
        <p className="text-pottery-600">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Completed Orders',
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  // Calculate max revenue for bar chart scaling
  const revenueByMonth = stats?.revenueByMonth || [];
  const maxRevenue = Math.max(...revenueByMonth.map(m => m.revenue), 1);
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Orders by status for donut-style display
  const ordersByStatus = stats?.ordersByStatus || [];
  const totalOrdersForChart = ordersByStatus.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-pottery-800">Admin Dashboard</h1>
          <p className="text-pottery-600 mt-1">Overview of your pottery store</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/orders" className="btn btn-secondary text-sm flex items-center gap-2">
            <Package size={16} /> Manage Orders
          </Link>
          <Link to="/admin/products" className="btn btn-primary text-sm flex items-center gap-2">
            <ShoppingCart size={16} /> Manage Products
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="card p-6 fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon size={24} />
                </div>
                <TrendingUp size={18} className="text-pottery-400" />
              </div>
              <p className="text-2xl font-bold text-pottery-800">{card.value}</p>
              <p className="text-sm text-pottery-600">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-pottery-600" size={20} />
            <h3 className="font-display font-bold text-pottery-800">Revenue (Last 6 Months)</h3>
          </div>
          {revenueByMonth.length === 0 ? (
            <p className="text-pottery-500 text-sm text-center py-8">No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {revenueByMonth.map((m, i) => {
                const height = Math.max((m.revenue / maxRevenue) * 100, 5);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-pottery-600 font-medium">
                      ₹{(m.revenue / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-pottery-600 rounded-t-md transition-all hover:bg-pottery-700"
                      style={{ height: `${height}%` }}
                      title={`₹${m.revenue.toLocaleString()} (${m.count} orders)`}
                    />
                    <span className="text-xs text-pottery-500">
                      {monthNames[m._id.month]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-pottery-800 mb-6">Orders by Status</h3>
          <div className="space-y-4">
            {ordersByStatus.map((s, i) => {
              const pct = Math.round((s.count / totalOrdersForChart) * 100);
              const label = STATUS_LABELS[s._id] || s._id;
              const color = STATUS_COLORS[s._id] || 'bg-pottery-500';
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-pottery-700 font-medium">{label}</span>
                    <span className="text-pottery-600">{s.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-pottery-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {ordersByStatus.length === 0 && (
            <p className="text-pottery-500 text-sm text-center py-8">No orders yet</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-pottery-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-pottery-600 hover:text-pottery-800 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-pottery-500 text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pottery-200">
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Order</th>
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Customer</th>
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Total</th>
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-pottery-600 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id} className="border-b border-pottery-100 hover:bg-pottery-50">
                    <td className="py-3 px-2 font-medium text-pottery-800">{order.orderNumber}</td>
                    <td className="py-3 px-2 text-pottery-700">{order.user?.name || 'N/A'}</td>
                    <td className="py-3 px-2 text-pottery-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </td>
                    <td className="py-3 px-2 font-medium text-pottery-800">₹{order.total?.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[order.orderStatus] || 'bg-gray-400'}`} />
                      <span className="text-pottery-700">{STATUS_LABELS[order.orderStatus] || order.orderStatus}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
