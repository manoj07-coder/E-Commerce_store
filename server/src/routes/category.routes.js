import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoriesById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoriesById);

router.post("/", authGuard, roleGuard(["seller", "admin"]), createCategory);
router.put("/:id", authGuard, roleGuard(["seller", "admin"]), updateCategory);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteCategory);

export default router;
