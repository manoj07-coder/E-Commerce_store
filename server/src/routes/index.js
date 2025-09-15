import { Router } from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import categoryRouter from "./category.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import stripeWebhookRouter from "./webhook.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/webhooks", stripeWebhookRouter);

export default router;
