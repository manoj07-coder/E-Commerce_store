// routes/webhook.js
import express from "express";
import Stripe from "stripe";
import { ENV } from "../config/env.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = express.Router();
const stripe = new Stripe(ENV.STRIPE_SECRET, { apiVersion: "2024-06-20" });

// helper function: mark order as paid and update stock
async function markOrderPaid(orderId) {
  const order = await Order.findById(orderId);
  if (!order) {
    console.error("❌ Order not found:", orderId);
    return;
  }

  order.status = "paid";
  order.paymentInfo.status = "succeeded";
  order.paidAt = new Date();
  await order.save();

  // decrement stock for each product
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty },
    });
  }

  // clear user’s cart
  await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });

  console.log("✅ Order updated to paid:", orderId);
}

router.post(
  "/stripe",
  express.raw({ type: "application/json" }), // must be raw body
  async (req, res) => {
    console.log("🔔 Stripe webhook received at:", new Date().toISOString());
    const signature = req.headers["stripe-signature"];
    const endpointSecret = ENV.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    try {
      if (event.type === "checkout.session.completed") {
        const orderId = data.metadata?.orderId;
        if (orderId) {
          await markOrderPaid(orderId);
        } else {
          console.warn("⚠️ No orderId in Checkout metadata");
        }
      }

      if (event.type === "payment_intent.succeeded") {
        const orderId = data.metadata?.orderId;
        if (orderId) {
          await markOrderPaid(orderId);
        } else {
          console.warn("⚠️ No orderId in PaymentIntent metadata");
        }
      }

      if (
        event.type !== "checkout.session.completed" &&
        event.type !== "payment_intent.succeeded"
      ) {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("❌ Error updating order:", err);
    }

    res.json({ received: true });
  }
);

export default router;
