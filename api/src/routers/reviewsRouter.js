import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

//public routes
reviewsRouter.get("/", getAllReviews);
reviewsRouter.get("/:id", getReviewById);

//protected routes
reviewsRouter.post("/book/:id", authenticate, createReview);
reviewsRouter.put("/:id", authenticate, updateReview);
reviewsRouter.delete("/:id", authenticate, deleteReview);

export default reviewsRouter;
