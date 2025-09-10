import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authGuard, roleGuard(["seller", "admin"]), createProduct);
router.put("/:id", authGuard, roleGuard(["seller", "admin"]), updateProduct);
router.delete("/:id", authGuard, roleGuard(["seller", "admin"]), deleteProduct);

export default router;
