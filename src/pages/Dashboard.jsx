import React from 'react';
import { 
  IndianRupee, 
  ShoppingCart, 
  Package, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function Dashboard({ stats, products, orders, onNavigate, onSelectOrder }) {
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: '+18.4% this month',
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || orders.length,
      change: `${stats.pendingOrders || 0} pending action`,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Live Products',
      value: products.length,
      change: `${lowStockProducts.length} low stock alerts`,
      icon: Package,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Pending Dispatch',
      value: stats.pendingOrders || 0,
      change: 'Requires packaging',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview & Performance</h2>
          <p className="text-sm text-slate-500">Real-time statistics for SleepNest e-commerce catalog and orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('add-product')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{card.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Low Stock Alert ({lowStockProducts.length} items)
              </p>
              <p className="text-xs text-amber-700">
                {lowStockProducts.map(p => p.name).join(', ')} have 5 or fewer items left in warehouse.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
          >
            Manage Inventory
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
            <p className="text-xs text-slate-500">Latest customer purchases made via Razorpay & COD</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-slate-800 text-sm">{order.customer?.name}</div>
                    <div className="text-xs text-slate-400">{order.customer?.city || 'India'}</div>
                  </td>
                  <td className="py-3.5 px-5 text-xs text-slate-600">
                    {order.items?.length || 1} item(s)
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

