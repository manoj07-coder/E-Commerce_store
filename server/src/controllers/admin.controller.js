import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

//total sales order count, revenue
export const salesReport = asyncHandler(async (req, res) => {
  const range = req.query.range || "30d";
  const [stats] = await Order.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
  ]);
  res.json(ok(stats || { totalRevenue: 0, orders: 0 }));
});

export const popularProducts = asyncHandler(async (req, res) => {
  const agg = await Order.aggregate([
    { $match: { status: "paid" } },
    { $unwind: "$items" },
    { $group: { _id: "$items.product", sold: { $sum: "$items.qty" } } },
    { $sort: { sold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        sold: 1,
        product: {
          name: "$product.name",
          price: "$product.price",
          id: "$product._id",
        },
      },
    },
  ]);

  res.json(ok(agg));
});
