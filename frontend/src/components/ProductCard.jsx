import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product, onQuickView, onShowToast }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    if (onShowToast) {
      onShowToast(`Added "${product.name}" to cart`, 'success');
    }
    setTimeout(() => setAdded(false), 1200);
  };

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="product-card" onClick={() => onQuickView(product)}>
      <div className="card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className="card-category-badge">{product.category}</span>
        {product.isFeatured && <span className="featured-flag">Enterprise Choice</span>}
      </div>

      <div className="card-content">
        <div className="card-rating-row">
          <span className="stars">★ {product.rating || '4.8'}</span>
          <span className="reviews">({product.numReviews || '18'} reviews)</span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-short-desc">
          {product.description?.length > 90
            ? `${product.description.slice(0, 90)}...`
            : product.description}
        </p>

        <div className="card-footer-row">
          <div className="price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">
              {Number(product.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>

          <div className="stock-indicator">
            {isOutOfStock ? (
              <span className="stock-out">Out of Stock</span>
            ) : (
              <span className="stock-in">In Stock ({product.countInStock})</span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn-quickview"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            Quick View
          </button>

          <button
            className={`btn-add-cart ${added ? 'btn-added' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {added ? '✓ Added' : isOutOfStock ? 'Sold Out' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
