const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');
const { orderConfirmationTemplate, orderStatusTemplate } = require('../utils/emailTemplates');

// POST /api/orders - create an order
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    if (!items || !items.length) return res.status(400).json({ success:false, message: 'No items provided' });

    // Optionally validate stock and reduce stock
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(404).json({ success:false, message: 'Product not found' });
      if (p.stock < it.quantity) return res.status(400).json({ success:false, message: `Insufficient stock for ${p.name}` });
      p.stock = p.stock - it.quantity;
      await p.save();
    }

    const order = await Order.create({ user: req.user._id, items, total, shippingAddress, paymentMethod });
    // send confirmation email (async)
    try {
      const userEmail = req.user.email;
      const html = orderConfirmationTemplate(order, req.user);
      await sendMail({ to: userEmail, subject: 'Your ShopNest order confirmation', html });
    } catch (e) {
      console.error('Email send failed', e.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success:false, message: err.message });
  }
});

// GET /api/orders/my - get current user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// GET /api/orders/:id - get an order (owner or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success:false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success:false, message: 'Access denied' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// GET /api/orders - admin: list all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, email } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (email) {
      // find user id by email
      const User = require('../models/User');
      const u = await User.findOne({ email });
      if (u) filter.user = u._id;
      else filter.user = null; // will return empty
    }
    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// PATCH /api/orders/:id/status - admin update order status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success:false, message: 'Status is required' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success:false, message: 'Order not found' });
    order.status = status;
    await order.save();
    // notify user about status change
    try {
      const o = await Order.findById(order._id).populate('user', 'name email');
      if (o.user && o.user.email) {
        const html = orderStatusTemplate(order, o.user);
        await sendMail({ to: o.user.email, subject: `Order ${order._id} status updated`, html });
      }
    } catch (e) {
      console.error('Status email failed', e.message);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// PATCH /api/orders/:id - admin update arbitrary fields (tracking, notes, refunded, carrier)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { trackingNumber, shippingCarrier, adminNotes, refunded } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success:false, message: 'Order not found' });
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (shippingCarrier !== undefined) order.shippingCarrier = shippingCarrier;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (refunded !== undefined) order.refunded = refunded;
    await order.save();

    // notify user about tracking/refund changes
    try {
      const o = await Order.findById(order._id).populate('user', 'name email');
      if (o.user && o.user.email) {
        const html = `Hello ${o.user.name || ''},<p>Your order <strong>${o._id}</strong> has been updated by admin.</p>${order.trackingNumber?`<p>Tracking: ${order.trackingNumber}</p>`:''}${order.refunded?'<p>Your order has been marked refunded.</p>':''}`;
        await sendMail({ to: o.user.email, subject: `Order ${o._id} updated by admin`, html });
      }
    } catch (e) {
      console.error('Admin update email failed', e.message);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

module.exports = router;
