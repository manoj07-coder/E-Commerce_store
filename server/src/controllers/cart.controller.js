// controllers/cartController.js
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import { ok } from "../utils/apiResponse.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";
import { ENV } from "../config/env.js";

const stripe = new Stripe(ENV.STRIPE_SECRET, { apiVersion: "2024-06-20" });

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: { message: "Product not found" },
    });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].qty += qty;
    cart.items[idx].price = product.price;
  } else {
    cart.items.push({ product: productId, qty, price: product.price });
  }

  await cart.save();
  res.json(ok(cart));
});

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart) cart = { items: [] };
  res.json(ok(cart));
});

export const checkOut = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: "Cart empty" },
    });
  }

  // compute total and prepare items
  let total = 0;
  const items = cart.items.map((i) => {
    total += i.qty * i.price;
    return { product: i.product._id, qty: i.qty, price: i.price };
  });

  // create Order in DB
  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    status: "pending",
  });

  // create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map((i) => ({
      price_data: {
        currency: "inr",
        product_data: { name: i.product.name },
        unit_amount: i.price * 100,
      },
      quantity: i.qty,
    })),
    mode: "payment",
    metadata: { orderId: order._id.toString() },
    payment_intent_data: { metadata: { orderId: order._id.toString() } }, // ✅ also on PaymentIntent
    success_url: `http://localhost:4000/api/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:4000/api/cancel`,
  });

  // save session info in order
  order.paymentInfo = {
    provider: "stripe",
    checkoutSessionId: session.id,
    status: "pending",
  };
  await order.save();

  // ❌ don't clear cart here — let webhook do it after payment succeeds

  res.json(ok({ orderId: order._id, checkoutUrl: session.url }));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images"
  );
  if (!cart) return res.status(404).json(error("Cart not found"));

  const item = cart.items.find((i) => i.product._id.toString() === productId);
  if (!item) return res.status(404).json(error("Item not found in cart"));

  if (qty <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product._id.toString() !== productId
    );
  } else {
    item.qty = qty;
  }

  await cart.save();
  res.json(ok(cart));
});

export const removeCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    return res.status(404).json({ error: { message: "Cart not found" } });

  cart.items = [];

  await cart.save();
  res.json(ok(cart));
});
