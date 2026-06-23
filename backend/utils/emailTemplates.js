function orderSummaryHtml(order) {
  const rows = order.items.map(i => `<tr><td style="padding:6px;border:1px solid #eee">${i.name}</td><td style="padding:6px;border:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:6px;border:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`).join('');
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:8px">
      <thead><tr><th style="text-align:left;padding:6px;border:1px solid #eee">Item</th><th style="padding:6px;border:1px solid #eee">Qty</th><th style="padding:6px;border:1px solid #eee;text-align:right">Price</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:8px">Total: <strong>$${order.total.toFixed(2)}</strong></p>
    ${order.trackingNumber ? `<p>Tracking: ${order.trackingNumber} (${order.shippingCarrier||''})</p>` : ''}
  `;
}

function orderConfirmationTemplate(order, user) {
  const orderUrlBase = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
      <h2 style="color:#4f46e5">ShopNest — Order Confirmation</h2>
      <p>Hi ${user.name || 'Customer'},</p>
      <p>Thanks for your order. We've received it and will process it shortly.</p>
      <p>Order ID: <strong>${order._id}</strong> — <a href="${orderUrlBase}/orders/${order._id}">View order</a></p>
      ${orderSummaryHtml(order)}
      <p style="color:#6b7280">If you have any questions reply to this email.</p>
      <p>Thanks,<br/>ShopNest</p>
    </div>
  `;
}

function orderStatusTemplate(order, user) {
  const orderUrlBase = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
      <h2 style="color:#4f46e5">ShopNest — Order Update</h2>
      <p>Hi ${user.name || 'Customer'},</p>
      <p>Your order <strong>${order._id}</strong> status has been updated to <strong>${order.status}</strong>.</p>
      <p>View details: <a href="${orderUrlBase}/orders/${order._id}">Order ${order._id}</a></p>
      ${orderSummaryHtml(order)}
      ${order.adminNotes ? `<p><strong>Note from store:</strong><br/>${order.adminNotes}</p>` : ''}
      <p>Thanks,<br/>ShopNest</p>
    </div>
  `;
}

module.exports = { orderConfirmationTemplate, orderStatusTemplate };
