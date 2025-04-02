// components/ProductDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products, addToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <Link to="/" className="back-to-products">&larr; Back to Products</Link>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <div className="product-detail-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          <div className="product-sustainability">
            <h2>Sustainability</h2>
            <p>At Cozy Threads, we're committed to ethical manufacturing and sustainable materials. This item is made with eco-friendly processes and materials, reducing environmental impact while providing premium quality.</p>
          </div>
          
          <button 
            className="add-to-cart-large"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;