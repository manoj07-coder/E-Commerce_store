import Category from "../models/Category.js";
import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, error: { message: "Name is required" } });
  }
  const existing = await Category.findOne({ name });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, error: { message: "Category already exists" } });
  }
  const category = await Category.create({ name });
  res.status(201).json(ok(category));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.status(200).json(ok(categories));
});

export const getCategoriesById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(404)
      .json({ success: false, error: { message: "Category not found" } });
  }
  res.status(200).json(ok(category));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Category not found",
      },
    });
  }
  if (name) {
    category.name = name;
  }
  await category.save();
  res.status(200).json(ok(category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, error: { message: "Category not found" } });
  }
  await category.deleteOne();
  res.json(ok({ id: req.params.id }));
});
