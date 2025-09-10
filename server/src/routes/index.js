import { Router } from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import categoryRouter from "./category.routes.js";
import cartRouter from "./cart.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);

export default router;
