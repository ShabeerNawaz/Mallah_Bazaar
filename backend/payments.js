const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");
const { notifyAdminPaymentUpdate } = require("../utils/notify");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @route  POST /api/payments/create-intent
// Creates a Stripe PaymentIntent for a given order and returns the client secret
router.post("/create-intent", protect, async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe uses smallest currency unit
      currency: "usd",
      metadata: { orderId: order._id.toString() },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/payments/webhook
// Stripe calls this to confirm payment success/failure.
// NOTE: this route must receive the RAW body, so it's mounted with express.raw() in server.js
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const order = await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { paymentStatus: "paid", status: "paid" },
      { new: true }
    );
    if (order) notifyAdminPaymentUpdate(order, "paid");
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const order = await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { paymentStatus: "failed" },
      { new: true }
    );
    if (order) notifyAdminPaymentUpdate(order, "failed");
  }

  res.json({ received: true });
});

module.exports = router;
