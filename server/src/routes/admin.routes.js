import { Router } from "express";
import { salesReport } from "../controllers/admin.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

router.get("/sales", authGuard, roleGuard(["admin"]), salesReport);

export default router;
