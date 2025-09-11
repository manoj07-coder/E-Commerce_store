import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import { ok } from "../utils/apiResponse.js";

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
