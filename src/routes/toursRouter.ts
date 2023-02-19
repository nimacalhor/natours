import express from "express";
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliasTopTour,
  getToursStats,
  getMonthlyPlan,
} from "../controllers/toursController";
import { protect, restrictTo } from "../controllers/authController";
import reviewRouter from "./reviewRouter";

const router = express.Router();

router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/stats").get(getToursStats);
router.route("/top-5-cheapest").get(aliasTopTour, getAllTours);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// review
router.use("/:tourId/review", reviewRouter);
export default router;
