import Product from "../models/Product.js";
import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import Category from "../models/Category.js";

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

export const getProducts = asyncHandler(async (req, res) => {});

export const getProductById = asyncHandler(async (req, res) => {});

export const updateProduct = asyncHandler(async (req, res) => {});

export const deleteProduct = asyncHandler(async (req, res) => {});
