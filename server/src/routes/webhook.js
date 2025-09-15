// routes/webhook.js
import express from "express";
import Stripe from "stripe";
import { ENV } from "../config/env.js";
import Order from "../models/Order.js";

const router = express.Router();
const stripe = new Stripe(ENV.STRIPE_SECRET, { apiVersion: "2024-06-20" });

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
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
      console.error("Webhook verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const orderId = data.metadata?.orderId;
          if (!orderId) break;
          await Order.findByIdAndUpdate(orderId, {
            status: "paid",
            "paymentInfo.status": "succeeded",
          });
          console.log("✅ Order paid via Checkout Session:", orderId);
          break;

        case "payment_intent.succeeded":
          const piOrderId = data.metadata?.orderId;
          if (!piOrderId) break;
          await Order.findByIdAndUpdate(piOrderId, {
            status: "paid",
            "paymentInfo.status": "succeeded",
          });
          console.log("✅ Order paid via PaymentIntent:", piOrderId);
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }

    res.json({ received: true });
  }
);

export default router;
