import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", authGuard, addToCart);
router.get("/", authGuard, getCart);

export default router;
