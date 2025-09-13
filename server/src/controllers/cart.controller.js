import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import { ok } from "../utils/apiResponse.js";
import Order from "../models/Order.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, error: { message: "Product not found" } });
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
      error: {
        message: "Cart empty",
      },
    });
  }

  // compute total and prepare items
  let total = 0;
  const items = cart.items.map((i) => {
    total += i.qty * i.price;
    return { product: i.product._id, qty: i.qty, price: i.price };
  });

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    status: "pending",
  });

  //push an email job to Redis list for the worker
  const { getRedis } = await import("../loaders/redis.js");
  const redis = getRedis();
  const payload = {
    to: req.user.email,
    subject: "Order received",
    html: `<p>Your order ${order._id} was created </p>`,
  };
  await redis.lpush("email:queue", JSON.stringify(payload));

  res.json(ok({ orderId: order._id }));
});
