import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import Order from "../models/Order.js";

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
