import React from 'react';
import { useProducts } from '../../contexts/ProductsContext';
import { useCart } from '../../contexts/CartContext';
import './Products.css';

const Products = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="products-container">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button 
              className="add-to-cart-button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;