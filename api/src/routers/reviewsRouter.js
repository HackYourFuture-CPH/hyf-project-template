import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getAllReviews,
  getReviewById,
  createReview,
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

//public routes
reviewsRouter.get("/", getAllReviews);
reviewsRouter.get("/:id", getReviewById);

//protected routes
reviewsRouter.post("/", authenticate, createReview);
export default reviewsRouter;
