// components/Cart.js - Updated with isLoading prop
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cart, updateQuantity, removeFromCart, calculateTotal, createPaymentIntent, isLoading = false }) => {
  const navigate = useNavigate();

  const handleCheckout = async () => {
    await createPaymentIntent();
    // We only need to navigate if the createPaymentIntent was successful
    // The navigation will now be handled by the App component when clientSecret is set
    if (!isLoading) {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="cart-item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
                disabled={isLoading}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
                disabled={isLoading}
              >
                +
              </button>
            </div>
            
            <div className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              className="remove-item"
              onClick={() => removeFromCart(item.id)}
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-totals">
          <div className="cart-subtotal">
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="cart-shipping">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="cart-tax">
            <span>Tax:</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="cart-actions">
          <Link to="/" className="continue-shopping" tabIndex={isLoading ? -1 : 0}>
            Continue Shopping
          </Link>
          <button 
            className="proceed-to-checkout"
            onClick={handleCheckout}
            disabled={isLoading || cart.length === 0}
          >
            {isLoading ? (
              <>
                Processing... 
                <span className="loading-indicator">◌</span>
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;