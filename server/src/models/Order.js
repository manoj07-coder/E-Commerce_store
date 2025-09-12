import mongoose from "mongoose";

const OrderItems = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    qty: Number,
    price: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [OrderItems],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    paymentInfo: {
      provider: String,
      providerId: String,
      status: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
