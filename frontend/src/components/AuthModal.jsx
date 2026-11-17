import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const { login, register, switchRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister) {
      if (!formData.name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      setLoading(false);
      if (res.success) {
        if (onShowToast) onShowToast(`Welcome, ${formData.name}!`, 'success');
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      if (res.success) {
        if (onShowToast) onShowToast('Signed in successfully!', 'success');
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickLogin = (role) => {
    switchRole(role);
    if (onShowToast) {
      onShowToast(
        `Switched to demo ${role === 'admin' ? 'Executive Admin' : 'Customer Client'}`,
        'info'
      );
    }
    onClose();
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        <div className="auth-body">
          <div className="auth-intro">
            <h3>{isRegister ? 'Join Cognevance Enterprise' : 'Sign in to your Portal'}</h3>
            <p>
              {isRegister
                ? 'Create an enterprise account to initiate procurements and track shipments.'
                : 'Access your order history, enterprise agreements, and analytics.'}
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="input-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>Business Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {isRegister && (
              <div className="input-group">
                <label>Account Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="role-select"
                >
                  <option value="customer">Procurement Client (Standard)</option>
                  <option value="admin">Platform Administrator (Store Admin)</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading
                ? 'Authenticating...'
                : isRegister
                ? 'Register Account'
                : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Access Buttons for Evaluators */}
          <div className="quick-demo-section">
            <span className="demo-divider">1-Click Fast Demo Login</span>
            <div className="quick-demo-buttons">
              <button
                type="button"
                className="btn-demo-pill client"
                onClick={() => handleQuickLogin('customer')}
              >
                👤 Login as Demo Customer
              </button>
              <button
                type="button"
                className="btn-demo-pill admin"
                onClick={() => handleQuickLogin('admin')}
              >
                ⚡ Login as Demo Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
