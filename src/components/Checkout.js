// components/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

const Checkout = ({ clientSecret, cart, calculateTotal, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    // Validate the form data
    if (Object.values(formData).some(value => value === '')) {
      setPaymentError('Please fill out all required fields');
      setIsProcessing(false);
      return;
    }
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
        receipt_email: formData.email,
        payment_method_data: {
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      },
      redirect: 'if_required',
    });
    
    setIsProcessing(false);
    
    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Clear the cart after successful payment
      clearCart();
      navigate('/confirmation');
    }
  };

  if (!clientSecret) {
    return <div className="loading">Loading checkout...</div>;
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form-container">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            
            <h2>Payment Information</h2>
            <div className="payment-element-container">
              <PaymentElement />
            </div>
            
            {paymentError && (
              <div className="payment-error">
                {paymentError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="payment-button"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="order-item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="order-subtotal">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="order-shipping">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="order-tax">
              <span>Tax:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="order-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;