import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import {
  addToCart,
  checkOut,
  getCart,
  removeCart,
  updateCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", authGuard, addToCart);
router.get("/", authGuard, getCart);
router.post("/checkout", authGuard, checkOut);
router.put("/:productId", authGuard, updateCartItem);
router.delete("/", authGuard, removeCart);

export default router;
