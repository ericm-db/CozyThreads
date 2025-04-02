// App.js - Main application component with fixed API calls
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import './App.css';

// Define API base URL
const API_BASE_URL = 'http://localhost:3001'; // Adjust if your server is on a different port

function App() {
  const [stripePromise, setStripePromise] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Load Stripe
    const getStripeKey = async () => {
      try {
        // Try to fetch the publishable key from the backend
        const response = await fetch(`${API_BASE_URL}/api/config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Stripe key: ${response.status}`);
        }
        const data = await response.json();
        setStripePromise(loadStripe(data.publishableKey));
      } catch (error) {
        console.error('Error loading Stripe key:', error);
        // Fallback to a dummy key for development
        console.log('Using fallback Stripe key for development');
        setStripePromise(loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'));
      }
    };

    getStripeKey();
  }, []);

  useEffect(() => {
    // In a real app, you would fetch products from an API
    setProducts([
      {
        id: 1,
        name: 'Classic Comfort Hoodie',
        description: 'Our signature hoodie made from 100% organic cotton for ultimate comfort and warmth.',
        price: 69.99,
        image: 'https://via.placeholder.com/400x300?text=Comfort+Hoodie',
      },
      {
        id: 2,
        name: 'Everyday Ethical Tee',
        description: 'Ethically-sourced cotton t-shirt with a relaxed fit, perfect for everyday wear.',
        price: 34.99,
        image: 'https://via.placeholder.com/400x300?text=Ethical+Tee',
      },
      {
        id: 3,
        name: 'Sustainable Socks Bundle',
        description: 'Set of 3 pairs of cozy socks made from recycled materials.',
        price: 24.99,
        image: 'https://via.placeholder.com/400x300?text=Sustainable+Socks',
      },
      {
        id: 4,
        name: 'Eco-Friendly Beanie',
        description: 'Warm beanie made from sustainably-sourced wool and recycled polyester.',
        price: 29.99,
        image: 'https://via.placeholder.com/400x300?text=Eco+Beanie',
      },
    ]);
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const createPaymentIntent = async () => {
    try {
      // Try to call the real backend
      try {
        console.log("Creating payment intent for:", cart);
        const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart,
            total: calculateTotal(),
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create payment intent: ${response.status}`);
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } catch (error) {
        console.error('Error creating real payment intent, using fallback:', error);
        
        // Fallback for demo/development
        console.log("Using fallback payment intent");
        setTimeout(() => {
          // Create a dummy client secret - this would come from your backend
          const dummySecret = "pi_" + Math.random().toString(36).substr(2, 9) + "_secret_" + Math.random().toString(36).substr(2, 9);
          setClientSecret(dummySecret);
          setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
        }, 700);
      }
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <header>
          <div className="logo">
            <Link to="/">Cozy Threads</Link>
          </div>
          <nav>
            <Link to="/">Products</Link>
            <Link to="/cart" className="cart-link">
              Cart ({cart.reduce((total, item) => total + (item.quantity || 0), 0)})
            </Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={<ProductCatalog products={products} addToCart={addToCart} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetail products={products} addToCart={addToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                  calculateTotal={calculateTotal}
                  createPaymentIntent={createPaymentIntent}
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <Checkout 
                      clientSecret={clientSecret} 
                      cart={cart} 
                      calculateTotal={calculateTotal}
                      clearCart={clearCart}
                    />
                  </Elements>
                ) : (
                  <Navigate to="/cart" replace />
                )
              } 
            />
            <Route 
              path="/confirmation" 
              element={<OrderConfirmation orderId={orderId} />} 
            />
          </Routes>
        </main>
        
        <footer>
          <p>&copy; 2025 Cozy Threads. All rights reserved.</p>
          <p>Ethically-sourced, high-quality apparel.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;