import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { cartItems, itemsSubtotal, shippingFee, estimatedTax, orderTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@enterprise.com',
    phone: '+1 555-0199',
    company: 'Cognevance Partner Corp',
    address: '400 Technology Center Dr',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'USA',
    paymentMethod: 'Demo Corporate Card (**** 4242)'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      },
      orderItems: cartItems.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty
      })),
      paymentMethod: formData.paymentMethod,
      itemsPrice: Number(itemsSubtotal.toFixed(2)),
      shippingPrice: Number(shippingFee.toFixed(2)),
      taxPrice: Number(estimatedTax.toFixed(2)),
      totalAmount: Number(orderTotal.toFixed(2))
    };

    const res = await createOrder(orderPayload);
    setLoading(false);

    if (res.success && res.data) {
      clearCart();
      onClose();
      onOrderPlaced(res.data);
    }
  };

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <div>
            <h3>Procurement Checkout (Demo)</h3>
            <p>Review shipping and submit purchase order without real billing.</p>
          </div>
          <button className="checkout-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form-grid">
          <div className="checkout-left-col">
            <h4 className="section-heading">1. Customer & Delivery Information</h4>
            <div className="input-group-row">
              <div className="input-field">
                <label>Contact Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-field">
                <label>Business Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group-row">
              <div className="input-field">
                <label>Organization / Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-field">
              <label>Delivery Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group-tri">
              <div className="input-field">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-field">
                <label>State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <label>Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h4 className="section-heading" style={{ marginTop: '1.5rem' }}>
              2. Demo Payment Instrument
            </h4>
            <div className="payment-options">
              <label className="payment-radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Demo Corporate Card (**** 4242)"
                  checked={formData.paymentMethod.includes('Card')}
                  onChange={handleChange}
                />
                <span className="radio-content">
                  <strong>Corporate Demo Card</strong>
                  <small>Instant simulation &bull; Zero real charge</small>
                </span>
              </label>

              <label className="payment-radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Enterprise Purchase Order (Net-30)"
                  checked={formData.paymentMethod.includes('Purchase Order')}
                  onChange={handleChange}
                />
                <span className="radio-content">
                  <strong>Corporate PO (Net-30)</strong>
                  <small>Automated B2B invoicing simulation</small>
                </span>
              </label>
            </div>
          </div>

          <div className="checkout-right-col">
            <h4 className="section-heading">Order Summary</h4>
            <div className="order-items-preview">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="preview-row">
                  <span className="preview-qty">{item.qty}×</span>
                  <span className="preview-name">{item.name}</span>
                  <span className="preview-price">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-calc-box">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>${itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Freight Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="calc-row">
                <span>Estimated Tax (8%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="calc-total-row">
                <span>Total Due</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit-order"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing Order...' : `Place Demo Order &bull; $${orderTotal.toFixed(2)}`}
            </button>

            <p className="demo-notice-text">
              🔒 <strong>Sandbox Mode:</strong> This is a demo environment. No real funds will be transferred.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
