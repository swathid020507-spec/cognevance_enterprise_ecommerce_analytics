import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import HealthCheckCard from './components/HealthCheckCard';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { fetchProducts, FALLBACK_CATEGORIES } from './services/api';
import './App.css';

function MainApp() {
  const [currentView, setCurrentView] = useState('store'); // 'store' | 'admin' | 'health'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Modal dialog states
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const loadCatalog = async () => {
    setLoading(true);
    const res = await fetchProducts({
      search: searchQuery,
      category: selectedCategory,
      sort: sortOption
    });

    if (res.success && res.data) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCatalog();
  }, [searchQuery, selectedCategory, sortOption]);

  const handleOrderPlaced = (order) => {
    setConfirmedOrder(order);
    showToast(`Order ${order.orderNumber} placed successfully!`, 'success');
  };

  return (
    <div className="app-layout">
      {/* Persistent Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Router */}
      <main className="main-content">
        {currentView === 'store' && (
          <>
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <section id="catalog-section" className="storefront-section">
              <div className="section-title-row">
                <div>
                  <h2 className="section-title">Enterprise Hardware & Solution Catalog</h2>
                  <p className="section-subtitle">
                    Certified servers, AI workstations, high-throughput storage, and business telemetry.
                  </p>
                </div>
              </div>

              {/* Search & Category Filter Toolbar */}
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                totalResults={products.length}
              />

              {/* Product Grid */}
              {loading ? (
                <div className="catalog-loading">
                  <div className="loading-spinner" />
                  <p>Loading enterprise catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="catalog-empty">
                  <span className="empty-icon">🔍</span>
                  <h3>No products found</h3>
                  <p>Try refining your search keyword or clearing the active category filter.</p>
                  <button
                    className="btn-reset-filters"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => {
                    const id = product._id || product.id;
                    return (
                      <ProductCard
                        key={id}
                        product={product}
                        onQuickView={setActiveProduct}
                        onShowToast={showToast}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {currentView === 'admin' && (
          <section className="admin-view-section">
            <AdminDashboard onShowToast={showToast} />
          </section>
        )}

        {currentView === 'health' && (
          <section className="health-view-section">
            <div className="health-view-intro">
              <h2>System Diagnostics & Backend API Health</h2>
              <p>
                Real-time connection verification with Express.js server and MongoDB Mongoose layer.
              </p>
            </div>
            <HealthCheckCard />
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onShowToast={showToast}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onShowToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
