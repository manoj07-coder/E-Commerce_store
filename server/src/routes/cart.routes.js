import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import { addToCart } from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", authGuard, addToCart);

export default router;
