import React, { useEffect, useState } from 'react';
import { fetchOrderById, adminUpdateOrderStatus, adminUpdateOrder } from '../utils/api';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './OrderDetailPage.css';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchOrderById(id).then(res => setOrder(res.data.order)).catch(err => toast.error('Failed to load order')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;
  if (!order) return <div className="page"><h3>Order not found</h3></div>;

  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (s) => {
    try {
      await adminUpdateOrderStatus(order._id, s);
      toast.success('Status updated');
      const res = await fetchOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAdminSave = async () => {
    try {
      const data = { trackingNumber: order.trackingNumber || '', shippingCarrier: order.shippingCarrier || '', adminNotes: order.adminNotes || '', refunded: !!order.refunded };
      await adminUpdateOrder(order._id, data);
      toast.success('Order updated');
      const res = await fetchOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Order {order._id}</h1>
      <div className="order-grid">
        <div className="card">
          <h3>Status</h3>
          <div className="status-row">
            <span className={`badge status ${order.status}`}>{order.status}</span>
            {isAdmin && (
              <select defaultValue={order.status} onChange={(e) => handleStatusChange(e.target.value)}>
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Items</h3>
          {order.items.map(it => (
            <div key={it.product} className="order-item">
              <span>{it.name}</span>
              <span>{it.quantity} × ${it.price.toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="order-total">Total: ${order.total.toFixed(2)}</div>

          {isAdmin && (
            <div style={{ marginTop: 12 }}>
              <label>Tracking Number</label>
              <input className="input" value={order.trackingNumber||''} onChange={(e)=>setOrder({...order, trackingNumber: e.target.value})} />
              <label>Carrier</label>
              <input className="input" value={order.shippingCarrier||''} onChange={(e)=>setOrder({...order, shippingCarrier: e.target.value})} />
              <label>Admin Notes</label>
              <textarea className="input" rows={3} value={order.adminNotes||''} onChange={(e)=>setOrder({...order, adminNotes: e.target.value})} />
              <div style={{ marginTop:8 }}>
                <label style={{ marginRight:8 }}><input type="checkbox" checked={!!order.refunded} onChange={(e)=>setOrder({...order, refunded: e.target.checked})} /> Mark refunded</label>
              </div>
              <div style={{ marginTop:10 }}>
                <button className="btn btn-primary" onClick={handleAdminSave}>Save</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
