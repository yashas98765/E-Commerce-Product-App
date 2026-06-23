import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden', 'Beauty'];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 8, sort: 'newest' })
      .then(res => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content container">
          <span className="hero-eyebrow">✦ New arrivals every week</span>
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="hero-gradient">Live Better</span>
          </h1>
          <p className="hero-desc">
            Discover thousands of products across electronics, fashion, books, and more.
            Fast shipping, easy returns, and prices that make sense.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
            <Link to="/products?category=Electronics" className="btn btn-outline btn-lg">Shop Electronics</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">16+</span><span className="stat-label">Products</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><span className="stat-num">8</span><span className="stat-label">Categories</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Secure</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-card">
              <span className="cat-icon">{getCatIcon(cat)}</span>
              <span className="cat-name">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Latest Products</h2>
          <Link to="/products" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        {loading ? (
          <div className="loading-screen"><div className="spinner"></div></div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="cta-section container">
        <div className="cta-card">
          <div>
            <h2>Admin? Manage Your Store</h2>
            <p>Login as admin to add, edit, or delete products from your inventory.</p>
          </div>
          <Link to="/login" className="btn btn-accent btn-lg">Go to Admin Panel →</Link>
        </div>
      </section>
    </div>
  );
}

function getCatIcon(cat) {
  const icons = {
    'Electronics': '💻', 'Clothing': '👕', 'Books': '📚',
    'Sports': '⚽', 'Home & Garden': '🏡', 'Beauty': '✨',
    'Food': '🍎', 'Toys': '🎮', 'Other': '📦'
  };
  return icons[cat] || '📦';
}
