import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CartPage.css';
import { createOrder } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any products yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} removed from cart`);
  };

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  return (
    <div className="page">
      <div className="cart-header">
        <h1 className="page-title">Shopping Cart</h1>
        <button className="btn btn-outline btn-sm" onClick={() => {
          clearCart();
          toast.success('Cart cleared');
        }}>Clear Cart</button>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Img'; }}
              />
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                <span className="badge badge-primary cart-item-cat">{item.category}</span>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >+</button>
                </div>
                <div className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => handleRemove(item)}>🗑 Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-ship">FREE</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <hr className="divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 20 }}
            onClick={async () => {
              try {
                if (!user) {
                  toast.error('Please login to place an order');
                  return navigate('/login');
                }
                const items = cartItems.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity }));
                const total = parseFloat((cartTotal * 1.08).toFixed(2));
                const res = await createOrder({ items, total, paymentMethod: 'demo' });
                clearCart();
                toast.success('🎉 Order placed!');
                navigate('/orders');
              } catch (err) {
                console.error(err);
                toast.error(err?.response?.data?.message || 'Order failed');
              }
            }}
          >
            Checkout →
          </button>
          <Link to="/products" className="btn btn-outline" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
