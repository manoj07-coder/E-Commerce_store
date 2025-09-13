import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import {
  addToCart,
  checkOut,
  getCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", authGuard, addToCart);
router.get("/", authGuard, getCart);
router.post("/checkout", authGuard, checkOut);

export default router;
