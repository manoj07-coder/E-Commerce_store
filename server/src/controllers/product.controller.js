import Product from "../models/Product.js";
import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import Category from "../models/Category.js";
import { getRedis } from "../loaders/redis.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }
  const slug = slugify(name, { lower: true });
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    slug,
    seller: req.user._id,
  });
  res.status(201).json(ok({ product }));
});

// List products with pagination, filtering and sorting
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q,
    minPrice,
    maxPrice,
    sort = "-createdAt",
    category,
  } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxprice) };
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);
  const items = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate("category", "name slug")
    .populate("seller", "name email")
    .lean();

  res.json(ok({ total, page: Number(page), limit: Number(limit), items }));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const redis = getRedis();
  const cacheKey = `product:${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return res.json(ok(JSON.parse(cached)));
  }

  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("seller", "name email")
    .lean();

  if (!product) {
    return res
      .status(404)
      .json({ success: false, error: { message: "Product not found" } });
  }

  await redis.setex(cacheKey, 60, JSON.stringify(product));
  res.json(ok(product));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Product.findByIdAndUpdate(id, req.body, { new: true })
    .populate("category", "name slug")
    .populate("seller", "name email")
    .lean();

  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { message: "Product not found" } });
  }

  //invalidate redis cache
  const redis = getRedis();
  await redis.del(`product:${id}`);

  res.json(ok(doc));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);

  //invalidate redis cache
  const redis = getRedis();
  await redis.del(`product:${id}`);

  res.json(ok({ id }));
});
