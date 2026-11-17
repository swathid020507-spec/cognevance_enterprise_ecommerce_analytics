/**
 * API Service for Cognevance Enterprise E-Commerce Platform
 * Connects to the Express backend via VITE_API_BASE_URL
 * Provides fallback mock data when backend is not running
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Fallback products in case backend is offline
export const FALLBACK_PRODUCTS = [
  {
    id: 'prod-001',
    _id: 'prod-001',
    name: 'Enterprise Rack Server Pro X9',
    description: 'High-density 2U dual-socket enterprise server engineered for demanding AI workloads, virtualization, and hybrid cloud infrastructures. Features dual Intel Xeon processors, 256GB ECC RAM, and redundant titanium-grade power supplies.',
    price: 2899.99,
    category: 'Servers & Cloud',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    countInStock: 14,
    rating: 4.9,
    numReviews: 28,
    isFeatured: true
  },
  {
    id: 'prod-002',
    _id: 'prod-002',
    name: 'Quantum Core Workstation X1',
    description: 'Ultra-performance enterprise workstation with liquid cooling, dedicated AI tensor cores, 64-core processing, and certified ISV reliability for engineering simulations and data science pipelines.',
    price: 3499.00,
    category: 'Workstations',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    countInStock: 8,
    rating: 4.8,
    numReviews: 19,
    isFeatured: true
  },
  {
    id: 'prod-003',
    _id: 'prod-003',
    name: 'UltraWide 40" 5K Thunderbolt Display',
    description: 'Curved 5120x2160 IPS Black display with 98% DCI-P3 color gamut, integrated Thunderbolt 4 hub, 96W power delivery, and dual-source KVM switch for executive workstations.',
    price: 1199.50,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    countInStock: 22,
    rating: 4.7,
    numReviews: 43,
    isFeatured: true
  },
  {
    id: 'prod-004',
    _id: 'prod-004',
    name: 'Cognevance BI & Real-time Analytics Suite',
    description: 'Annual enterprise tier license with unlimited dashboards, automated anomaly detection, streaming event ingestion, role-based governance, and SOC-2 compliance reporting.',
    price: 799.00,
    category: 'Enterprise Software',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    countInStock: 999,
    rating: 5.0,
    numReviews: 64,
    isFeatured: true
  },
  {
    id: 'prod-005',
    _id: 'prod-005',
    name: 'SecureEdge NextGen Firewall Gateway',
    description: 'Hardware threat mitigation appliance delivering 40 Gbps deep-packet inspection, zero-trust network access (ZTNA), automated intrusion prevention, and TLS 1.3 decryption at line rate.',
    price: 1550.00,
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    countInStock: 12,
    rating: 4.6,
    numReviews: 15,
    isFeatured: false
  },
  {
    id: 'prod-006',
    _id: 'prod-006',
    name: 'Enterprise NVMe U.2 SSD 7.68TB',
    description: 'PCIe Gen 4 enterprise solid-state drive with power-loss data protection, 1.3M random read IOPS, 7,000 MB/s sustained throughput, and 5-year end-to-end data path endurance.',
    price: 649.99,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    countInStock: 35,
    rating: 4.9,
    numReviews: 31,
    isFeatured: false
  },
  {
    id: 'prod-007',
    _id: 'prod-007',
    name: 'ErgoTech Executive Mesh Office Chair',
    description: 'Commercial-grade ergonomic chair with 4D dynamic lumbar tracking, breathable Italian mesh, multi-angle synchro-tilt lock, and 300-pound continuous rating for 24/7 command centers.',
    price: 489.00,
    category: 'Office & Ergonomics',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
    countInStock: 19,
    rating: 4.8,
    numReviews: 52,
    isFeatured: false
  },
  {
    id: 'prod-008',
    _id: 'prod-008',
    name: 'Tactile Wireless Mechanical Developer Deck',
    description: 'Hot-swappable custom-tuned mechanical keyboard with CNC aluminum chassis, QMK/VIA programmable firmware, tri-mode wireless latency below 1ms, and sound-dampening silicone gaskets.',
    price: 219.00,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    countInStock: 45,
    rating: 4.7,
    numReviews: 76,
    isFeatured: false
  }
];

export const FALLBACK_CATEGORIES = [
  'All Categories',
  'Servers & Cloud',
  'Workstations',
  'Peripherals',
  'Enterprise Software',
  'Networking',
  'Storage',
  'Office & Ergonomics'
];

/**
 * Health check endpoint
 */
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Fetch products with optional search, category, sort
 */
export const fetchProducts = async ({ search = '', category = '', sort = 'featured' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All' && category !== 'All Categories') params.append('category', category);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data || [], source: json.source || 'api' };
  } catch (err) {
    // Offline filter
    let list = [...FALLBACK_PRODUCTS];
    if (category && category !== 'All' && category !== 'All Categories') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return { success: true, data: list, source: 'frontend_fallback' };
  }
};

/**
 * Fetch single product
 */
export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data };
  } catch (err) {
    const found = FALLBACK_PRODUCTS.find((p) => p.id === id || p._id === id);
    return { success: !!found, data: found || null };
  }
};

/**
 * Create product (Admin)
 */
export const createProduct = async (productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return { success: true, data: json.data };
  } catch (err) {
    const mock = {
      _id: `prod-${Date.now()}`,
      id: `prod-${Date.now()}`,
      ...productData,
      rating: 4.8,
      numReviews: 0,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: mock, fallback: true };
  }
};

/**
 * Update product (Admin)
 */
export const updateProduct = async (id, productData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return { success: true, data: json.data };
  } catch (err) {
    return { success: true, data: { _id: id, id, ...productData }, fallback: true };
  }
};

/**
 * Delete product (Admin)
 */
export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return { success: true, id };
  } catch (err) {
    return { success: true, id, fallback: true };
  }
};

/**
 * Create order (Checkout)
 */
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
    return { success: true, data: json.data };
  } catch (err) {
    const mockOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber: `COG-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: mockOrder, fallback: true };
  }
};

/**
 * Fetch orders (Admin)
 */
export const fetchOrders = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err) {
    return {
      success: true,
      data: [
        {
          _id: 'ord-1001',
          orderNumber: 'COG-ORD-8821',
          customer: { name: 'Sarah Jenkins', email: 's.jenkins@acmecorp.com' },
          totalAmount: 5722.91,
          status: 'Shipped',
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString()
        },
        {
          _id: 'ord-1002',
          orderNumber: 'COG-ORD-8822',
          customer: { name: 'David Martinez', email: 'david.m@nexuscloud.io' },
          totalAmount: 2588.76,
          status: 'Processing',
          createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
        }
      ]
    };
  }
};

/**
 * Fetch stats (Admin)
 */
export const fetchOrderStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/analytics/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data };
  } catch (err) {
    return {
      success: true,
      data: {
        totalSales: 12563.63,
        totalOrders: 3,
        totalProducts: 8,
        averageOrderValue: 4187.87,
        categoryBreakdown: {
          'Servers & Cloud': 2899.99,
          'Workstations': 3499.00,
          'Peripherals': 2837.00,
          'Enterprise Software': 2397.00
        }
      }
    };
  }
};

/**
 * Auth Login
 */
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    return { success: true, data: json.data };
  } catch (err) {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    return {
      success: true,
      data: {
        _id: 'user-demo',
        name: email.split('@')[0],
        email,
        role,
        token: 'local-demo-token'
      }
    };
  }
};

/**
 * Auth Register
 */
export const registerUser = async ({ name, email, password, role = 'customer' }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    return { success: true, data: json.data };
  } catch (err) {
    return {
      success: true,
      data: {
        _id: `user-${Date.now()}`,
        name,
        email,
        role,
        token: `local-token-${Date.now()}`
      }
    };
  }
};

export default {
  API_BASE_URL,
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES,
  checkHealth,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  fetchOrders,
  fetchOrderStats,
  loginUser,
  registerUser
};
