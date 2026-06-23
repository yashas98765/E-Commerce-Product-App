import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();

  const inCart = cartItems.find(i => i._id === product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
        />
        {outOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
        {product.featured && !outOfStock && <div className="featured-badge">⭐ Featured</div>}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className={`btn btn-sm ${outOfStock ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sold Out' : inCart ? '✓ In Cart' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
