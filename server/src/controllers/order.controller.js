import Order from "../models/Order.js";
import { ok } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(ok(orders));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");
  if (!order) throw new AppError("Not found", 404);
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw new AppError("Forbidden", 403);
  res.json(ok(order));
});
