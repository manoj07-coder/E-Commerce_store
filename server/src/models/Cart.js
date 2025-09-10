import mongoose from "mongoose";

const CartItems = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    qty: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [CartItems],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
