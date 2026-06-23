import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProductById(id)
      .then(res => setProduct(res.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return null;

  const inCart = cartItems.find(i => i._id === product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const renderStars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="product-detail">
        <div className="detail-img-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x450?text=No+Image'; }}
          />
          {product.featured && <div className="featured-badge">⭐ Featured</div>}
        </div>

        <div className="detail-info">
          <span className="badge badge-primary">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="review-count">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price">${product.price.toFixed(2)}</div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {outOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : (
              <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
            )}
          </div>

          {!outOfStock && (
            <div className="qty-row">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="qty-btn">−</button>
                <span className="qty-val">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="qty-btn">+</button>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={outOfStock}
              style={{ flex: 1 }}
            >
              {outOfStock ? 'Out of Stock' : inCart ? '✓ Add More to Cart' : '🛒 Add to Cart'}
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
