import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPayment } from '../../services/api';
import './Payments.css';

const Payments = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [status, setStatus] = useState(null);

  // Calculate total amount from cart items
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  ).toFixed(2);

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('processing');
    
    try {
      // Send payment with cart details
      await sendPayment({
        ...paymentData,
        amount: totalAmount,
        items: cartItems
      });
      
      setStatus('success');
      // Reset form
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: '',
      });
      
      // Clear the cart after successful payment
      clearCart();
      
      // Redirect to success page or products after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="payment-container">
        <h2>Payment</h2>
        <p className="empty-cart-message">Your cart is empty. Add some products first.</p>
        <button 
          className="back-to-products"
          onClick={() => navigate('/')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul className="order-items">
          {cartItems.map(item => (
            <li key={item.id} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="order-total">
          <span>Total:</span>
          <span>${totalAmount}</span>
        </div>
      </div>
      
      {status === 'success' && (
        <div className="success-message">
          Payment successful! Redirecting to products...
        </div>
      )}
      
      {status === 'error' && (
        <div className="error-message">
          Payment failed. Please check your details and try again.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="name">Cardholder Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={paymentData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={paymentData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="payment-actions">
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
          <button 
            type="submit" 
            className="pay-button"
            disabled={status === 'processing'}
          >
            {status === 'processing' ? 'Processing...' : `Pay $${totalAmount}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payments;