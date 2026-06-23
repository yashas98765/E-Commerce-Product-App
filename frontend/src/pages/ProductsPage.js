import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    fetchProducts(params)
      .then(res => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setSidebarOpen(false);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="products-page">
      {/* Top bar */}
      <div className="products-topbar container">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{pagination.total || 0} items found</p>
        </div>
        <div className="topbar-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="input search-input"
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="input sort-select"
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ⚡ Filters
          </button>
        </div>
      </div>

      <div className="products-layout container">
        {/* Sidebar */}
        <aside className={`filters-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>Clear all</button>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
                {category === cat && <span>✓</span>}
              </button>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <form onSubmit={handlePriceFilter} className="price-form">
              <input
                type="number"
                className="input"
                placeholder="Min $"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="input"
                placeholder="Max $"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Apply
              </button>
            </form>
          </div>
        </aside>

        {/* Products grid */}
        <div className="products-main">
          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <span className="page-info">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
