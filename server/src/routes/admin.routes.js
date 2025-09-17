import { Router } from "express";
import {
  popularProducts,
  salesReport,
} from "../controllers/admin.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

router.get("/sales", authGuard, roleGuard(["admin"]), salesReport);
router.get("/popular", authGuard, roleGuard(["admin"]), popularProducts);

export default router;
