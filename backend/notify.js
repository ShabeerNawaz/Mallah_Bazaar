const transporter = require("../config/mailer");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Core sender - wrapped in try/catch at call sites so a failed email
// never breaks the actual request (order/payment/signup still succeeds).
const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Mallah Bazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: "${subject}" -> ${to}`);
  } catch (err) {
    console.error(`Failed to send email "${subject}":`, err.message);
  }
};

// --- Admin notifications ---

const notifyAdminNewOrder = (order) => {
  const itemsHtml = order.items
    .map((i) => `<li>${i.qty} x ${i.name} — $${i.price.toFixed(2)} each</li>`)
    .join("");

  return sendMail({
    to: ADMIN_EMAIL,
    subject: `New order placed — $${order.total.toFixed(2)}`,
    html: `
      <h2>New order received</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Total:</b> $${order.total.toFixed(2)}</p>
      <ul>${itemsHtml}</ul>
      <p><b>Shipping to:</b> ${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}</p>
    `,
  });
};

const notifyAdminOrderStatusChanged = (order) => {
  return sendMail({
    to: ADMIN_EMAIL,
    subject: `Order ${order._id} status changed to "${order.status}"`,
    html: `<p>Order <b>${order._id}</b> is now marked as <b>${order.status}</b>.</p>`,
  });
};

const notifyAdminPaymentUpdate = (order, outcome) => {
  return sendMail({
    to: ADMIN_EMAIL,
    subject:
      outcome === "paid"
        ? `Payment received — $${order.total.toFixed(2)}`
        : `Payment FAILED for order ${order._id}`,
    html: `
      <p>Order <b>${order._id}</b> payment status: <b>${outcome}</b></p>
      <p>Total: $${order.total.toFixed(2)}</p>
    `,
  });
};

const notifyAdminNewUser = (user) => {
  return sendMail({
    to: ADMIN_EMAIL,
    subject: `New user signed up: ${user.name}`,
    html: `<p><b>${user.name}</b> (${user.email}) just created an account.</p>`,
  });
};

const notifyAdminLowStock = (product) => {
  return sendMail({
    to: ADMIN_EMAIL,
    subject: `Low stock warning: ${product.name}`,
    html: `<p><b>${product.name}</b> has only <b>${product.stock}</b> units left.</p>`,
  });
};

// --- Customer-facing notification (optional but included since "everything" was requested) ---

const notifyCustomerOrderConfirmation = (order, customerEmail) => {
  return sendMail({
    to: customerEmail,
    subject: `Your order has been placed`,
    html: `
      <h2>Thanks for your order!</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Total:</b> $${order.total.toFixed(2)}</p>
      <p>We'll notify you when it ships.</p>
    `,
  });
};

module.exports = {
  notifyAdminNewOrder,
  notifyAdminOrderStatusChanged,
  notifyAdminPaymentUpdate,
  notifyAdminNewUser,
  notifyAdminLowStock,
  notifyCustomerOrderConfirmation,
};
