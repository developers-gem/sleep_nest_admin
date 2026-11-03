import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Settings, 
  Moon, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: stats?.productCount },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: stats?.pendingOrders, badgeColor: 'bg-amber-500' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Moon className="w-5 h-5 fill-white text-emerald-400" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
            SleepNest
            <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">Admin</span>
          </h1>
          <p className="text-xs text-slate-400">Store Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || (isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Backend & Server
        </div>
        <div className="px-3.5 py-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span>API Target:</span>
            <span className="font-mono text-[11px] text-emerald-400">:3000</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Database:</span>
            <span className="text-slate-200 font-medium">MongoDB</span>
          </div>
        </div>
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
            SN
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-200">SleepNest Admin</p>
            <p className="text-[11px] text-slate-400">admin@sleepnest.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

