import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import { listOrders } from "../controllers/order.controller.js";

const router = Router();

router.get("/", authGuard, listOrders);

export default router;
