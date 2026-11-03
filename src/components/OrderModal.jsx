import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck,
  Calendar
} from 'lucide-react';

export default function OrderModal({ order, onClose, onStatusUpdate }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                {order.orderNumber}
              </span>
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Payment: {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {new Date(order.createdAt || Date.now()).toLocaleString('en-IN')}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-800 flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Status Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Order Status</p>
              <p className="text-sm font-bold text-slate-900 capitalize mt-0.5">{order.orderStatus}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Change:</span>
              <select
                value={order.orderStatus}
                onChange={(e) => onStatusUpdate(order._id, { orderStatus: e.target.value })}
                className="text-xs font-bold px-3 py-1.5 bg-white border border-slate-300 rounded-xl capitalize shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Contact</h4>
              <p className="text-sm font-bold text-slate-900">{order.customer?.name}</p>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.customer?.email}</span>
              </p>
              {order.customer?.phone && (
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer?.phone}</span>
                </p>
              )}
            </div>

            {/* Address Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Address</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {order.customer?.address?.street || 'N/A'}<br />
                {order.customer?.address?.city}, {order.customer?.address?.state} - {order.customer?.address?.postalCode}<br />
                {order.customer?.address?.country || 'India'}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items in this Order</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=120'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-slate-500">Size: {item.size}</p>
                      )}
                      <p className="text-xs text-slate-400">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-400">₹{(item.price || 0).toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Payment Gateway:</span>
              <span className="font-semibold uppercase text-slate-800">{order.paymentMethod || 'Razorpay'}</span>
            </div>
            {order.paymentId && (
              <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Payment ID:</span>
                <span className="text-emerald-700 font-bold">{order.paymentId}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
              <span>Total Paid / Payable:</span>
              <span className="text-emerald-600">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

