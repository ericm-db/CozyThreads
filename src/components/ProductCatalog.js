// components/ProductCatalog.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCatalog.css';

const ProductCatalog = ({ products, addToCart }) => {
  return (
    <div className="product-catalog">
      <h1>Our Products</h1>
      <p className="catalog-intro">
        Discover our collection of high-quality, ethically-sourced apparel and accessories.
      </p>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                <Link to={`/product/${product.id}`} className="view-details">
                  View Details
                </Link>
                <button 
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;