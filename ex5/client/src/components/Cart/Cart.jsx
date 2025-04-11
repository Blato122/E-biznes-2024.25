import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, removeFromCart }) => {
  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p className="empty-cart-message">Your cart is empty.</p>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <span>Quantity: {item.quantity}</span>
              </div>
            </div>
            <button 
              className="remove-button"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total-price">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="cart-actions">
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
          <Link to="/payment" className="checkout-button">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;