import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenAuth
}) {
  const { itemsCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <div
          className="navbar-brand"
          onClick={() => onNavigate('store')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-badge">C</div>
          <div className="brand-text">
            <span className="brand-name">Cognevance</span>
            <span className="brand-tag">Enterprise E-Commerce</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search enterprise servers, displays, GPUs, licenses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <button
            className={`nav-link-btn ${currentView === 'store' ? 'active' : ''}`}
            onClick={() => onNavigate('store')}
          >
            Catalog
          </button>

          <button
            className={`nav-link-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            Admin & Analytics {isAdmin && <span className="admin-chip">Admin</span>}
          </button>

          <button
            className={`nav-link-btn ${currentView === 'health' ? 'active' : ''}`}
            onClick={() => onNavigate('health')}
          >
            API Health
          </button>
        </nav>

        {/* Action Controls: Cart, Auth, and Role Switcher */}
        <div className="navbar-actions">
          {/* Cart Trigger */}
          <button
            className="cart-btn"
            onClick={onOpenCart}
            title="View Procurement Cart"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </button>

          {/* User Account / Role Pill */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div
                className="user-pill"
                onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                title="Click to toggle between Admin and Customer demo roles"
              >
                <span className="user-avatar-char">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="user-pill-text">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role-tag ${user.role}`}>
                    {user.role === 'admin' ? 'Executive Admin ⚡' : 'Procurement Client'}
                  </span>
                </div>
              </div>
              <button className="btn-logout" onClick={logout} title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-signin" onClick={onOpenAuth}>
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <button
            className={`mobile-nav-link ${currentView === 'store' ? 'active' : ''}`}
            onClick={() => {
              onNavigate('store');
              setMobileMenuOpen(false);
            }}
          >
            Enterprise Catalog
          </button>
          <button
            className={`mobile-nav-link ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
          >
            Admin & Analytics Dashboard
          </button>
          <button
            className={`mobile-nav-link ${currentView === 'health' ? 'active' : ''}`}
            onClick={() => {
              onNavigate('health');
              setMobileMenuOpen(false);
            }}
          >
            System Diagnostics / Health
          </button>
        </div>
      )}
    </header>
  );
}
