import { Router } from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import categoryRouter from "./category.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import stripeWebhookRouter from "./webhook.js";
import reviewRouter from "./review.routes.js";
import adminRouter from "./admin.routes.js";
import { getHealth } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/webhooks", stripeWebhookRouter);
router.use("/reviews", reviewRouter);
router.use("/admin", adminRouter);

export default router;
