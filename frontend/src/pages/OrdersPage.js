import React, { useEffect, useState } from 'react';
import { fetchMyOrders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      fetchMyOrders().then(res => setOrders(res.data.orders)).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
    } else if (!loading) {
      setLoadingOrders(false);
    }
  }, [loading, user]);

  if (loadingOrders) return <div className="loading-screen"><div className="spinner"/></div>;

  if (!user) return (
    <div className="page">
      <h2>Please log in to view your orders</h2>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48 }}>📦</div>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-row">
                <strong>Order</strong>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="order-row">
                <span>Status</span>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-row">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="order-items">
                {order.items.map(it => (
                  <div key={it.product} className="order-item">
                    <span>{it.name}</span>
                    <span>{it.quantity} × ${it.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
