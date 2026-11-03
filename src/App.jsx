import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import OrderModal from './components/OrderModal';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    productCount: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [prods, ords, st] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getStats(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setStats({
        ...st,
        productCount: prods.length,
      });
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product Actions
  const handleSaveProduct = async (productData, existingId) => {
    if (existingId) {
      const updated = await api.updateProduct(existingId, productData);
      showToast('Product updated successfully!');
    } else {
      const created = await api.createProduct(productData);
      showToast('New product added to SleepNest catalog!');
    }
    setProductToEdit(null);
    await loadData();
    setCurrentTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product from the catalog?')) {
      await api.deleteProduct(productId);
      showToast('Product deleted', 'info');
      await loadData();
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setCurrentTab('add-product');
  };

  // Order Actions
  const handleStatusUpdate = async (orderId, statusData) => {
    await api.updateOrderStatus(orderId, statusData);
    showToast(`Order status updated to "${statusData.orderStatus}"`);
    await loadData();
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, ...statusData }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'add-product') setProductToEdit(null);
          setCurrentTab(tab);
        }}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          onAddProductClick={() => {
            setProductToEdit(null);
            setCurrentTab('add-product');
          }}
        />

        {/* Global Toast Alert */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <span className={`w-2 h-2 rounded-full ${notification.type === 'info' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              products={products}
              orders={orders}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
            />
          )}

          {currentTab === 'products' && (
            <Products
              products={products}
              onAddClick={() => {
                setProductToEdit(null);
                setCurrentTab('add-product');
              }}
              onEditClick={handleEditProduct}
              onDeleteClick={handleDeleteProduct}
            />
          )}

          {currentTab === 'add-product' && (
            <AddProduct
              productToEdit={productToEdit}
              onSave={handleSaveProduct}
              onCancel={() => {
                setProductToEdit(null);
                setCurrentTab('products');
              }}
            />
          )}

          {currentTab === 'orders' && (
            <Orders
              orders={orders}
              onStatusUpdate={handleStatusUpdate}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
            />
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

