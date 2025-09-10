import { Router } from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import categoryRouter from "./category.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);

export default router;
