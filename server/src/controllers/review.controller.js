import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";
import { ok } from "../utils/apiResponse.js";

async function updateProductStats(productId) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const { avgRating, count } = stats[0];
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: Number(avgRating.toFixed(2)),
      ratingCount: count,
    });
  } else {
    // no reviews
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingCount: 0,
    });
  }
}

export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user && req.user._id;
  const { product: productId, rating, comment } = req.body;

  if (!productId) throw new AppError("Product id is required", 400);
  if (!rating || rating < 1 || rating > 5)
    throw new AppError("Rating must be 1-5", 400);

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  const existing = await Review.findOne({ product: productId, user: userId });
  if (existing) {
    throw new AppError("You have already reviewed this product", 400);
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  await updateProductStats(productId);

  res.status(201).json(ok(review));
});

export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;

  const total = await Review.countDocuments({ product: productId });
  const items = await Review.find({ product: productId })
    .populate("user", "name email")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();

  res.json(ok({ total, page, limit, items }));
});

export const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user && req.user._id;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) throw new AppError("Review not found", 404);

  //check ownership or admin
  if (
    review.user.toString() !== userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  if (rating !== undefined) {
    if (rating < 1 || rating > 5) throw new AppError("Rating must be 1-5", 400);
    review.rating = rating;
  }

  if (comment !== undefined) review.comment = comment;

  await review.save();

  await updateProductStats(review.product);

  const populated = await Review.findById(reviewId).populate(
    "user",
    "name email"
  );
  res.json(ok(populated));
});

export const deleteReview = asyncHandler(async (req, res) => {});

export const getAllReviews = asyncHandler(async (req, res) => {});
