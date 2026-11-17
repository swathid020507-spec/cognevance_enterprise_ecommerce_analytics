import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductModal.css';

export default function ProductModal({ product, onClose, onShowToast }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    if (onShowToast) {
      onShowToast(`Added ${qty} × "${product.name}" to cart`, 'success');
    }
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-product-layout">
          <div className="modal-image-col">
            <img
              src={product.image}
              alt={product.name}
              className="modal-product-img"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <span className="modal-category-chip">{product.category}</span>
          </div>

          <div className="modal-details-col">
            <div className="modal-header-meta">
              <span className="sku-tag">SKU: {product._id || product.id}</span>
              <span className="rating-badge">★ {product.rating || '4.8'} ({product.numReviews || '18'} reviews)</span>
            </div>

            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-price-row">
              <span className="modal-price">
                ${Number(product.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className={`modal-stock-status ${isOutOfStock ? 'out' : 'in'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.countInStock} units ready`}
              </span>
            </div>

            <div className="modal-desc-box">
              <h4>Description & Specifications</h4>
              <p>{product.description}</p>
            </div>

            <div className="modal-procurement-perks">
              <div className="perk-pill">✓ Tier-1 SLA Coverage</div>
              <div className="perk-pill">✓ Enterprise Bulk Invoicing Available</div>
              <div className="perk-pill">✓ Free Express Freight ($100+)</div>
            </div>

            {!isOutOfStock && (
              <div className="modal-qty-row">
                <label>Procurement Quantity:</label>
                <div className="qty-controls">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="qty-number">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                    disabled={qty >= product.countInStock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="modal-action-row">
              <button
                className={`btn-modal-add ${added ? 'btn-added' : ''}`}
                onClick={handleAdd}
                disabled={isOutOfStock}
              >
                {added ? '✓ Added to Cart!' : isOutOfStock ? 'Item Unavailable' : `Add ${qty} to Cart &bull; $${(product.price * qty).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
