import React from 'react';
import './OrderConfirmationModal.css';

export default function OrderConfirmationModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="confirmation-backdrop">
      <div className="confirmation-card">
        <div className="confirmation-badge-top">
          <div className="check-circle">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="order-subtext">
            Thank you for partnering with Cognevance Technologies. Your demo procurement order has been processed.
          </p>
        </div>

        <div className="order-receipt-box">
          <div className="receipt-header-row">
            <div>
              <span className="receipt-label">Order Number</span>
              <strong className="receipt-order-id">{order.orderNumber}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="receipt-label">Status</span>
              <span className="receipt-status-pill">{order.status || 'Processing'}</span>
            </div>
          </div>

          <div className="receipt-details-grid">
            <div>
              <span className="receipt-label">Ship To</span>
              <p className="receipt-text">
                <strong>{order.customer?.name}</strong><br />
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                {order.customer?.email}
              </p>
            </div>
            <div>
              <span className="receipt-label">Payment Method</span>
              <p className="receipt-text">
                {order.paymentMethod || 'Demo Enterprise Card'}<br />
                <span className="paid-tag">● PAID IN FULL</span>
              </p>
            </div>
          </div>

          <div className="receipt-items-list">
            <span className="receipt-label">Procured Items</span>
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <span>{item.qty}× {item.name}</span>
                <strong>${(item.price * item.qty).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="receipt-total-row">
            <span>Total Amount</span>
            <span className="total-bold">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print / Save Receipt
          </button>
          <button className="btn-continue" onClick={onClose}>
            Continue Shopping &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
