import React, { useState } from 'react';
import { sendPayment } from '../../services/api';

const Payments = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    amount: ''
  });
  const [status, setStatus] = useState(null);

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
      await sendPayment(paymentData);
      setStatus('success');
      // Reset form
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: '',
        amount: ''
      });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      {status === 'success' && <div className="success-message">Payment successful!</div>}
      {status === 'error' && <div className="error-message">Payment failed. Please try again.</div>}
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={status === 'processing'}>
          {status === 'processing' ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Payments;