// components/OrderConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = ({ orderId }) => {
  return (
    <div className="order-confirmation">
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <svg viewBox="0 0 24 24" width="64" height="64">
            <circle cx="12" cy="12" r="11" fill="#4CAF50" />
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
          </svg>
        </div>
        
        <h1>Thank You for Your Order!</h1>
        
        <p className="order-number">
          Order #{orderId || Math.floor(100000 + Math.random() * 900000)}
        </p>
        
        <p className="confirmation-message">
          We've received your order and are processing it now. You'll receive a confirmation email shortly with your order details.
        </p>
        
        <div className="delivery-info">
          <h2>Shipping Information</h2>
          <p>Your order will be shipped within 1-2 business days.</p>
          <p>Estimated delivery: 3-5 business days</p>
        </div>
        
        <div className="confirmation-actions">
          <Link to="/" className="back-to-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;