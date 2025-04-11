import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Payments from './components/Payments/Payments';
import Navigation from './components/Navigation/Navigation';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
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
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Navigation cartItemsCount={cartItemsCount} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Products addToCart={addToCart} />} />
            <Route path="/cart" element={
              <Cart 
                cartItems={cartItems} 
                removeFromCart={removeFromCart} 
              />
            } />
            <Route path="/payment" element={
              <Payments 
                cartItems={cartItems} 
                clearCart={clearCart} 
              />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;