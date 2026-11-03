import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function Orders({ orders, onStatusUpdate, onSelectOrder }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = 
      (order.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.phone || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h2>
        <p className="text-sm text-slate-500">Track shipments, verify customer payments and update fulfillment status.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800">No Orders Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No orders found for the selected filter or query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Order #</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Customer Info</th>
                  <th className="py-3 px-5">Items Ordered</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Payment</th>
                  <th className="py-3 px-5">Fulfillment Status</th>
                  <th className="py-3 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order # */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Recent'}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm">{order.customer?.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{order.customer?.email}</span>
                      </div>
                      {order.customer?.phone && (
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{order.customer?.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        {(order.items || []).slice(0, 2).map((item, i) => (
                          <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="font-semibold text-slate-900">×{item.quantity || 1}</span>
                            <span className="truncate max-w-[180px]">{item.name}</span>
                          </div>
                        ))}
                        {(order.items || []).length > 2 && (
                          <span className="text-[11px] text-slate-400 font-semibold">
                            +{(order.items || []).length - 2} more item(s)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-5 font-bold text-slate-900 text-sm whitespace-nowrap">
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <span className={`inline-block text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <div className="text-[11px] text-slate-400 font-medium uppercase">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-5">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onStatusUpdate(order._id, { orderStatus: e.target.value })}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border capitalize focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer ${getStatusBadge(order.orderStatus)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* View Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
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

