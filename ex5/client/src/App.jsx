import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Payments from './components/Payments/Payments';
import Navigation from './components/Navigation/Navigation';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import './App.css';

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navigation />
            <div className="container">
              <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payments />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;