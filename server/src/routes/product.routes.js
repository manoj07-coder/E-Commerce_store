import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

//public
router.get("/", getProducts);

//role based: admin or seller
router.get("/mine", authGuard, roleGuard(["seller", "admin"]), getMyProducts);
router.post("/", authGuard, roleGuard(["seller", "admin"]), createProduct);
router.put("/:id", authGuard, roleGuard(["seller", "admin"]), updateProduct);
router.delete("/:id", authGuard, roleGuard(["seller", "admin"]), deleteProduct);

router.get("/:id", getProductById);

export default router;
