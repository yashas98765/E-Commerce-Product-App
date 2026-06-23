import React, { useState, useEffect, useCallback } from 'react';
import { adminFetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminFetchStats, adminFetchOrders, adminUpdateOrderStatus, adminUpdateOrder } from '../utils/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food', 'Other'];

const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'Electronics',
  imageUrl: '', stock: '', rating: 0, numReviews: 0, featured: false
};

export default function AdminPage() {
  const [tab, setTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState('');
  const [orderFilterEmail, setOrderFilterEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    adminFetchProducts({ page, limit: 10, search })
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
        setTotal(res.data.total);
      })
      .catch(err => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (tab === 'stats') {
      adminFetchStats()
        .then(res => setStats(res.data.stats))
        .catch(() => toast.error('Failed to load stats'));
    }
    if (tab === 'orders') {
      loadOrders();
    }
  }, [tab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const params = {};
      if (orderFilterStatus) params.status = orderFilterStatus;
      if (orderFilterEmail) params.email = orderFilterEmail;
      const res = await adminFetchOrders(params);
      setOrders(res.data.orders);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, description: product.description,
      price: product.price, category: product.category,
      imageUrl: product.imageUrl, stock: product.stock,
      rating: product.rating, numReviews: product.numReviews,
      featured: product.featured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editProduct) {
        await adminUpdateProduct(editProduct._id, data);
        toast.success('Product updated!');
      } else {
        await adminCreateProduct(data);
        toast.success('Product created!');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteProduct(id);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage your store</p>
        </div>
        <div className="admin-tabs">
          <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            📦 Products
          </button>
            <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              🧾 Orders
            </button>
          <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
            📊 Analytics
          </button>
        </div>
      </div>

      {tab === 'products' && (
        <div className="admin-content">
          <div className="admin-toolbar">
            <input
              type="text"
              className="input"
              placeholder="🔍 Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <div className="toolbar-right">
              <span className="total-badge">{total} products</span>
              <button className="btn btn-primary" onClick={openCreate}>
                + Add Product
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>📦</div>
              <h3>No products found</h3>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>Add First Product</button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="table-product">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="table-img"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=?'; }}
                          />
                          <div>
                            <div className="table-product-name">{p.name}</div>
                            {p.featured && <span className="badge badge-accent" style={{ fontSize: 10 }}>Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td className="price-cell">${p.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 5 ? 'badge-accent' : 'badge-success'}`}>
                          {p.stock === 0 ? 'Out of Stock' : p.stock}
                        </span>
                      </td>
                      <td>⭐ {p.rating.toFixed(1)}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-content">
          <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center' }}>
            <input placeholder="Filter by user email" className="input" value={orderFilterEmail} onChange={e=>setOrderFilterEmail(e.target.value)} />
            <select className="input" style={{width:160}} value={orderFilterStatus} onChange={e=>setOrderFilterStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button className="btn btn-outline" onClick={loadOrders}>Apply</button>
            <button className="btn btn-outline" onClick={() => {
              // export CSV
              const csvRows = [];
              const headers = ['orderId','createdAt','userEmail','status','total','items','tracking','refunded'];
              csvRows.push(headers.join(','));
              orders.forEach(o => {
                const items = o.items.map(i=>`${i.name} x${i.quantity}`).join(' | ');
                const row = [o._id, new Date(o.createdAt).toISOString(), o.user?.email||'', o.status, o.total, `"${items}"`, o.trackingNumber||'', !!o.refunded];
                csvRows.push(row.join(','));
              });
              const csv = csvRows.join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(url);
            }}>Export CSV</button>
          </div>
          {ordersLoading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>🧾</div>
              <h3>No orders yet</h3>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                          <tr key={o._id}>
                      <td>
                        <a href={`/orders/${o._id}`} onClick={(e)=>{e.preventDefault(); window.location.href=`/orders/${o._id}`}}>
                          {new Date(o.createdAt).toLocaleString()}
                        </a>
                      </td>
                      <td>{o.user?.email || '—'}</td>
                      <td>${o.total.toFixed(2)}</td>
                      <td><span className={`badge`}>{o.status}</span></td>
                      <td>{o.items.length}</td>
                      <td>
                        <div className="table-actions">
                          <select defaultValue={o.status} onChange={async (e) => {
                            try {
                              await adminUpdateOrderStatus(o._id, e.target.value);
                              toast.success('Status updated');
                              // refresh
                              await loadOrders();
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}>
                            <option value="pending">pending</option>
                            <option value="processing">processing</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                          <button className="btn btn-outline btn-sm" onClick={async ()=>{
                            try {
                              await adminUpdateOrder(o._id, { refunded: !o.refunded });
                              toast.success('Refund toggled');
                              await loadOrders();
                            } catch (e) { toast.error('Failed'); }
                          }}>{o.refunded? 'Unrefund':'Refund'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-num">{stats.totalProducts}</div><div className="stat-card-label">Total Products</div></div>
          <div className="stat-card"><div className="stat-card-num">{stats.totalUsers}</div><div className="stat-card-label">Users</div></div>
          <div className="stat-card danger"><div className="stat-card-num">{stats.outOfStock}</div><div className="stat-card-label">Out of Stock</div></div>
          <div className="stat-card accent"><div className="stat-card-num">{stats.lowStock}</div><div className="stat-card-label">Low Stock (≤5)</div></div>

          <div className="stat-wide">
            <h3>Products by Category</h3>
            <div className="category-stats">
              {stats.categoryStats.map(cat => (
                <div key={cat._id} className="cat-stat-row">
                  <span className="cat-stat-name">{cat._id}</span>
                  <div className="cat-stat-bar">
                    <div
                      className="cat-stat-fill"
                      style={{ width: `${(cat.count / stats.totalProducts) * 100}%` }}
                    ></div>
                  </div>
                  <span className="cat-stat-count">{cat.count} — avg ${cat.avgPrice.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>{editProduct ? '✏️ Edit Product' : '+ New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Product Name *</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input type="number" step="0.01" min="0" className="input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" min="0" className="input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" className="input" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input className="input" placeholder="https://..." value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              </div>

              {form.imageUrl && (
                <div className="img-preview">
                  <img src={form.imageUrl} alt="preview" onError={(e) => { e.target.style.display='none'; }} />
                </div>
              )}

              <div className="form-group featured-check">
                <label>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span> Mark as Featured</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h2>Delete Product?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
