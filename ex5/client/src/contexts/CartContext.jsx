import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// context with default values
export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartItemsCount: 0
});

// provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Wrap callbacks in useCallback to prevent unnecessary re-renders if passed down
  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []); // Empty dependency array means this function reference never changes

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate cartItemsCount based on cartItems
  const cartItemsCount = useMemo(() => {
      return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);


  // Memoize the context value object
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartItemsCount
  }), [cartItems, addToCart, removeFromCart, clearCart, cartItemsCount]); // Dependencies that trigger recalculation

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Add PropTypes validation
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);