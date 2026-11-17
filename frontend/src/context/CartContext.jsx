import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cognevance_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cognevance_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const productId = product._id || product.id;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => (item._id || item.id) === productId);
      if (existing) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, qty: Math.min(item.qty + qty, item.countInStock || 99) }
            : item
        );
      }
      return [
        ...prevItems,
        {
          _id: productId,
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          countInStock: product.countInStock || 10,
          qty
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== productId)
    );
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId
          ? { ...item, qty: Math.min(qty, item.countInStock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingFee = itemsSubtotal > 100 || itemsCount === 0 ? 0 : 15.0;
  const estimatedTax = itemsSubtotal * 0.08;
  const orderTotal = itemsSubtotal + shippingFee + estimatedTax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsCount,
        itemsSubtotal,
        shippingFee,
        estimatedTax,
        orderTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
