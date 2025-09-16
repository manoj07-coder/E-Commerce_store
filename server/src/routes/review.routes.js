import { Router } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewsByProduct,
} from "../controllers/review.controller.js";
import { authGuard, roleGuard } from "../middlewares/auth.js";

const router = Router();

router.post("/", authGuard, createReview);
router.get("/product/:productId", getReviewsByProduct);
router.put("/:id", authGuard, updateReview);
router.delete("/:id", authGuard, deleteReview);
router.get("/", authGuard, roleGuard(["admin"]), getAllReviews);

export default router;
