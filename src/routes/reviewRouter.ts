import express from "express";
import {
  getAllReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewsController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").delete(deleteReview);

export default router;
