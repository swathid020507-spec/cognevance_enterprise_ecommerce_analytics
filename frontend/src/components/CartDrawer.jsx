import React from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, onProceedCheckout }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsCount,
    itemsSubtotal,
    shippingFee,
    estimatedTax,
    orderTotal
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-title">
            <h3>Enterprise Procurement Cart</h3>
            <span className="cart-counter-badge">{itemsCount} Items</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-view">
            <div className="empty-cart-icon">🛒</div>
            <h4>Your cart is empty</h4>
            <p>Select infrastructure hardware or enterprise licenses from the catalog to populate your order.</p>
            <button className="btn-browse-shop" onClick={onClose}>
              Explore Catalog
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-scroll">
              {cartItems.map((item) => {
                const id = item._id || item.id;
                return (
                  <div key={id} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumb"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    <div className="cart-item-info">
                      <span className="cart-item-category">{item.category}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-price-unit">
                        ${Number(item.price).toFixed(2)} each
                      </div>

                      <div className="cart-item-controls">
                        <div className="cart-qty-stepper">
                          <button
                            onClick={() => updateQuantity(id, item.qty - 1)}
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(id, item.qty + 1)}
                            disabled={item.qty >= (item.countInStock || 99)}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="cart-remove-item"
                          onClick={() => removeFromCart(id)}
                          title="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary-footer">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Standard Freight</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="free-tag">FREE</strong>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="summary-line">
                <span>Estimated Sales Tax (8%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="summary-total-line">
                <span>Estimated Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>

              <div className="cart-action-buttons">
                <button
                  className="btn-checkout"
                  onClick={() => {
                    onClose();
                    onProceedCheckout();
                  }}
                >
                  Proceed to Checkout &rarr;
                </button>
                <button className="btn-clear-cart" onClick={clearCart}>
                  Clear All Items
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
