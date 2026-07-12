const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const {
  notifyAdminNewOrder,
  notifyAdminOrderStatusChanged,
  notifyAdminLowStock,
  notifyCustomerOrderConfirmation,
} = require("../utils/notify");

const LOW_STOCK_THRESHOLD = 5;

const router = express.Router();

// @route  POST /api/orders  (logged-in user creates an order from cart)
router.post("/", protect, async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    // items: [{ productId, qty }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
      total += product.price * item.qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress,
    });

    // Decrement stock now that the order is placed, and flag any items
    // that just dropped to/below the low-stock threshold.
    for (const item of orderItems) {
      const updated = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } },
        { new: true }
      );
      if (updated && updated.stock <= LOW_STOCK_THRESHOLD) {
        notifyAdminLowStock(updated);
      }
    }

    // Fire-and-forget notifications - don't block the response on email sending
    notifyAdminNewOrder(order);
    notifyCustomerOrderConfirmation(order, req.user.email);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/mine  (logged-in user's own orders)
router.get("/mine", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders  (admin - all orders)
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/:id  (owner or admin)
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/orders/:id/status  (admin updates order status)
router.put("/:id/status", protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    notifyAdminOrderStatusChanged(order);

    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
