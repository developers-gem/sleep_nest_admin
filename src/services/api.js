const API_BASE = 'http://localhost:3000/api';

// Fallback demo data if backend has 0 records initially
const DEMO_PRODUCTS = [
  {
    _id: 'p1',
    name: 'SleepNest Ortho Cloud Mattress',
    brand: 'SleepNest',
    category: 'mattress',
    price: 18999,
    originalPrice: 24999,
    discountPrice: 18999,
    stock: 24,
    inStock: true,
    rating: 4.8,
    reviewCount: 142,
    isBestSeller: true,
    isNewArrival: false,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
    description: 'High-density memory foam with cooling gel layer designed for spinal alignment and posture relief.',
    material: 'Natural Latex & Memory Foam',
  },
  {
    _id: 'p2',
    name: 'SleepNest Contour Memory Pillow',
    brand: 'SleepNest',
    category: 'pillow',
    price: 2499,
    originalPrice: 3499,
    discountPrice: 2499,
    stock: 58,
    inStock: true,
    rating: 4.9,
    reviewCount: 310,
    isBestSeller: true,
    isNewArrival: true,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop',
    description: 'Ergonomic cervical neck pillow with bamboo washable cover for side and back sleepers.',
    material: '100% Breathable Memory Foam',
  },
  {
    _id: 'p3',
    name: 'Luxury Mulberry Silk Bedding Set',
    brand: 'SleepNest',
    category: 'bedding',
    price: 6999,
    originalPrice: 9999,
    discountPrice: 6999,
    stock: 12,
    inStock: true,
    rating: 4.7,
    reviewCount: 88,
    isBestSeller: false,
    isNewArrival: true,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
    description: 'Ultra-soft 400 thread count organic sateen cotton with hypoallergenic weave.',
    material: 'Organic Cotton & Silk',
  },
  {
    _id: 'p4',
    name: 'Dual Comfort Reversible Mattress',
    brand: 'SleepNest',
    category: 'mattress',
    price: 14499,
    originalPrice: 19999,
    discountPrice: 14499,
    stock: 4,
    inStock: true,
    rating: 4.6,
    reviewCount: 64,
    isBestSeller: false,
    isNewArrival: false,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop',
    description: 'Medium firm on one side, plush soft on the reverse side for versatile comfort.',
    material: 'HR Foam + Bonded Foam',
  }
];

const DEMO_ORDERS = [
  {
    _id: 'ord_1',
    orderNumber: 'SN-849201',
    customer: {
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      phone: '+91 98765 43210',
      address: {
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
      },
    },
    items: [
      {
        name: 'SleepNest Ortho Cloud Mattress (King)',
        price: 18999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        size: 'King (78x72)',
      },
    ],
    totalAmount: 18999,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    paymentId: 'pay_Nz82K39dLa9X',
    orderStatus: 'processing',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    _id: 'ord_2',
    orderNumber: 'SN-612480',
    customer: {
      name: 'Pooja Verma',
      email: 'pooja.v@example.com',
      phone: '+91 91234 56789',
      address: {
        street: 'B-14, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        postalCode: '201301',
        country: 'India',
      },
    },
    items: [
      {
        name: 'SleepNest Contour Memory Pillow',
        price: 2499,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400',
        size: 'Standard',
      },
      {
        name: 'Luxury Mulberry Silk Bedding Set',
        price: 6999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        size: 'Queen',
      },
    ],
    totalAmount: 11997,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    paymentId: 'pay_Kq92L01jMx4Z',
    orderStatus: 'shipped',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    _id: 'ord_3',
    orderNumber: 'SN-409123',
    customer: {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 99887 76655',
      address: {
        street: '7th Floor, Silver Arch, Marine Lines',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400020',
        country: 'India',
      },
    },
    items: [
      {
        name: 'Dual Comfort Reversible Mattress',
        price: 14499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        size: 'Queen (78x60)',
      },
    ],
    totalAmount: 14499,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    paymentId: '',
    orderStatus: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
  },
];

export const api = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/items?limit=1`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Products API
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/items?${query}`);
      if (!res.ok) throw new Error('Failed to fetch from server');
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
      return DEMO_PRODUCTS;
    } catch (e) {
      console.warn('Backend unavailable, using local product catalog:', e.message);
      return DEMO_PRODUCTS;
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create product');
      return json.data;
    } catch (e) {
      console.warn('Server create failed or offline, saving to local store:', e.message);
      const newProduct = {
        _id: 'prod_' + Date.now(),
        ...productData,
        createdAt: new Date().toISOString(),
      };
      DEMO_PRODUCTS.unshift(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update product');
      return json.data;
    } catch (e) {
      console.warn('Server update failed, updating local copy:', e.message);
      const index = DEMO_PRODUCTS.findIndex(p => p._id === id);
      if (index !== -1) {
        DEMO_PRODUCTS[index] = { ...DEMO_PRODUCTS[index], ...productData };
        return DEMO_PRODUCTS[index];
      }
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete on server');
      return true;
    } catch (e) {
      console.warn('Server delete failed, removing locally:', e.message);
      const idx = DEMO_PRODUCTS.findIndex(p => p._id === id);
      if (idx !== -1) DEMO_PRODUCTS.splice(idx, 1);
      return true;
    }
  },

  // Orders API
  async getOrders(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/orders?${query}`);
      if (!res.ok) throw new Error('Failed to fetch orders from server');
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
      return DEMO_ORDERS;
    } catch (e) {
      console.warn('Backend orders unavailable, using local orders:', e.message);
      return DEMO_ORDERS;
    }
  },

  async updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update order');
      return json.data;
    } catch (e) {
      console.warn('Server update order failed, updating locally:', e.message);
      const ord = DEMO_ORDERS.find(o => o._id === orderId);
      if (ord) {
        if (orderStatus) ord.orderStatus = orderStatus;
        if (paymentStatus) ord.paymentStatus = paymentStatus;
        return ord;
      }
      return null;
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/orders/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      return json.data;
    } catch {
      // Calculate local stats
      const totalRevenue = DEMO_ORDERS
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        totalOrders: DEMO_ORDERS.length,
        pendingOrders: DEMO_ORDERS.filter(o => o.orderStatus === 'pending').length,
        processingOrders: DEMO_ORDERS.filter(o => ['confirmed', 'processing'].includes(o.orderStatus)).length,
        deliveredOrders: DEMO_ORDERS.filter(o => o.orderStatus === 'delivered').length,
        totalRevenue,
      };
    }
  }
};

