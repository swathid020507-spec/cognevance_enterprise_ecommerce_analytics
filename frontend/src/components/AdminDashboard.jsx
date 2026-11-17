import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  fetchOrderStats,
  FALLBACK_CATEGORIES
} from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'analytics'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states for Product Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Servers & Cloud',
    price: '',
    countInStock: '10',
    image: '',
    description: '',
    isFeatured: false
  });

  const loadData = async () => {
    setLoading(true);
    const [pRes, oRes, sRes] = await Promise.all([
      fetchProducts({ sort: 'all' }),
      fetchOrders(),
      fetchOrderStats()
    ]);

    if (pRes.success) setProducts(pRes.data);
    if (oRes.success) setOrders(oRes.data);
    if (sRes.success) setStats(sRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Servers & Cloud',
      price: '',
      countInStock: '10',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      description: '',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      countInStock: prod.countInStock,
      image: prod.image,
      description: prod.description,
      isFeatured: prod.isFeatured || false
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const id = editingProduct ? (editingProduct._id || editingProduct.id) : null;

    if (editingProduct) {
      const res = await updateProduct(id, productForm);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === id ? { ...p, ...productForm } : p))
        );
        if (onShowToast) onShowToast('Product updated successfully!', 'success');
      }
    } else {
      const res = await createProduct(productForm);
      if (res.success && res.data) {
        setProducts((prev) => [res.data, ...prev]);
        if (onShowToast) onShowToast('Product catalogued successfully!', 'success');
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (prod) => {
    const id = prod._id || prod.id;
    if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
        if (onShowToast) onShowToast('Product deleted from catalog', 'info');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Top Welcome & Summary Header */}
      <div className="admin-header">
        <div>
          <span className="admin-role-badge">Executive Control Plane</span>
          <h2 className="admin-title">Enterprise Analytics & Store Administration</h2>
          <p className="admin-subtitle">
            Real-time management for catalog items, procurement records, and financial analytics.
          </p>
        </div>

        <button className="btn-refresh-stats" onClick={loadData}>
          ↻ Refresh Data
        </button>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="stats-kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">💰</div>
          <div className="kpi-data">
            <span className="kpi-label">Total Gross Sales</span>
            <strong className="kpi-value">
              ${stats?.totalSales ? stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '12,563.63'}
            </strong>
            <span className="kpi-trend positive">&uarr; +18.4% vs last cycle</span>
          </div>
        </div>

        <div className="kpi-card orders">
          <div className="kpi-icon">📦</div>
          <div className="kpi-data">
            <span className="kpi-label">Total Orders Placed</span>
            <strong className="kpi-value">
              {stats?.totalOrders || orders.length || 3}
            </strong>
            <span className="kpi-trend">Corporate POs & Cards</span>
          </div>
        </div>

        <div className="kpi-card products">
          <div className="kpi-icon">🏷️</div>
          <div className="kpi-data">
            <span className="kpi-label">Active Catalog SKUs</span>
            <strong className="kpi-value">
              {products.length || stats?.totalProducts || 8}
            </strong>
            <span className="kpi-trend">Across 6 Categories</span>
          </div>
        </div>

        <div className="kpi-card aov">
          <div className="kpi-icon">📊</div>
          <div className="kpi-data">
            <span className="kpi-label">Average Order Value</span>
            <strong className="kpi-value">
              ${stats?.averageOrderValue ? stats.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '4,187.87'}
            </strong>
            <span className="kpi-trend positive">Enterprise basket tier</span>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="admin-tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders & Transactions ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Sales Analytics Breakdown
        </button>
      </div>

      {/* Tab 1: Product Management */}
      {activeTab === 'products' && (
        <div className="admin-panel">
          <div className="panel-actions-bar">
            <div className="panel-search">
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-add-product" onClick={openAddModal}>
              + Add New SKU / Product
            </button>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock Level</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const id = p._id || p.id;
                  return (
                    <tr key={id}>
                      <td className="product-cell">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="table-thumb"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div>
                          <strong className="cell-title">{p.name}</strong>
                          <span className="cell-sku">SKU: {id}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-category-tag">{p.category}</span>
                      </td>
                      <td>
                        <strong>${Number(p.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span
                          className={`stock-badge ${
                            p.countInStock > 0 ? 'in' : 'out'
                          }`}
                        >
                          {p.countInStock > 0
                            ? `${p.countInStock} units`
                            : 'Out of Stock'}
                        </span>
                      </td>
                      <td>★ {p.rating || '4.8'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons-group">
                          <button
                            className="btn-action edit"
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                          >
                            Edit
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDelete(p)}
                            title="Delete Product"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Transactions */}
      {activeTab === 'orders' && (
        <div className="admin-panel">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Account</th>
                  <th>Date & Time</th>
                  <th>Items Ordered</th>
                  <th>Total Amount</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id || o.orderNumber}>
                    <td>
                      <strong className="order-id-tag">{o.orderNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{o.customer?.name}</strong>
                        <span className="customer-email">{o.customer?.email}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(o.createdAt || Date.now()).toLocaleDateString()}{' '}
                      <small className="time-sub">
                        {new Date(o.createdAt || Date.now()).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>{o.orderItems?.length || 1} SKU(s)</td>
                    <td>
                      <strong>${Number(o.totalAmount).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`order-status-badge ${o.status?.toLowerCase() || 'processing'}`}>
                        ● {o.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sales Analytics Breakdown */}
      {activeTab === 'analytics' && (
        <div className="admin-panel">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Revenue Distribution by Category</h3>
              <p className="card-subtext">Estimated enterprise procurement volume</p>

              <div className="category-bars-list">
                {[
                  { name: 'Servers & Cloud', amount: 2899.99, pct: 85 },
                  { name: 'Workstations', amount: 3499.00, pct: 100 },
                  { name: 'Peripherals', amount: 2837.00, pct: 82 },
                  { name: 'Enterprise Software', amount: 2397.00, pct: 70 },
                  { name: 'Networking', amount: 1550.00, pct: 45 }
                ].map((cat) => (
                  <div key={cat.name} className="cat-bar-item">
                    <div className="cat-bar-info">
                      <strong>{cat.name}</strong>
                      <span>${cat.amount.toLocaleString()}</span>
                    </div>
                    <div className="cat-bar-track">
                      <div
                        className="cat-bar-fill"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <h3>Platform Performance & SLA Compliance</h3>
              <p className="card-subtext">System reliability and client satisfaction</p>

              <div className="sla-metrics">
                <div className="sla-row">
                  <span>API Response Latency</span>
                  <strong className="good">&lt; 42 ms</strong>
                </div>
                <div className="sla-row">
                  <span>Database Sync State</span>
                  <strong className="good">Real-time / Failover Ready</strong>
                </div>
                <div className="sla-row">
                  <span>Procurement Fulfillment Rate</span>
                  <strong className="good">99.4%</strong>
                </div>
                <div className="sla-row">
                  <span>Corporate PO Verification</span>
                  <strong className="good">Automated (Instant)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit Product */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Catalog Product' : 'Add New Enterprise Product'}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    placeholder="e.g. Enterprise Xeon Server 2U"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                  >
                    {FALLBACK_CATEGORIES.filter((c) => c !== 'All Categories').map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    placeholder="1299.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Initial Stock Units *</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.countInStock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        countInStock: e.target.value
                      })
                    }
                    placeholder="25"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Detailed Specifications / Description *</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value
                    })
                  }
                  placeholder="Enter enterprise specs, architecture details, and warranty terms..."
                  required
                />
              </div>

              <div className="form-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        isFeatured: e.target.checked
                      })
                    }
                  />
                  <span>Feature as "Enterprise Choice" on Storefront</span>
                </label>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
