import { Router } from "express";
import { authGuard } from "../middlewares/auth.js";
import { getOrder, listOrders } from "../controllers/order.controller.js";

const router = Router();

router.get("/", authGuard, listOrders);
router.get("/:id", authGuard, getOrder);

export default router;
