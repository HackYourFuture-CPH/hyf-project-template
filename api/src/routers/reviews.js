import express from "express";
import knex from "../db.mjs";
import { reviewSchema } from "../validation/schemas.js";
import { validateRequest } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const reviewsRouter = express.Router({ mergeParams: true });

// Apply authentication
reviewsRouter.use(authenticateToken);

// function to update a tour average rating.
const updateTravelPlanRating = async (tour_id, trx) => {
  const db = trx || knex;
  const stats = await db("tour_reviews")
    .where({ tour_id })
    .count("rating as rating_count")
    .avg("rating as rating")
    .first();

  return db("travel_plans")
    .where({ id: tour_id })
    .update({
      rating_count: Number(stats.rating_count) || 0,
      rating: stats.rating || 0,
    });
};

// GET all reviews for a specific tour
reviewsRouter.get("/", async (req, res) => {
  try {
    const { id: tourId } = req.params;
    const reviews = await knex("tour_reviews")
      .where({ tour_id: tourId })
      .orderBy("created_at", "desc");
    res.json({
      message: "Reviews retrieved successfully.",
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      error: "Review retrieval failed",
      message: "We encountered an error while loading reviews.",
    });
  }
});

// Post a review for a specific tour
reviewsRouter.post("/", validateRequest(reviewSchema), async (req, res) => {
  try {
    const { id: tourId } = req.params;
    const userId = req.user.id || req.user.sub;
    const { rating, content } = req.validatedData;

    let newReview;
    await knex.transaction(async (trx) => {
      [newReview] = await trx("tour_reviews")
        .insert({ user_id: userId, tour_id: tourId, rating, content })
        .returning("*");
      await updateTravelPlanRating(tourId, trx);
    });

    res.status(201).json({
      message: "Thank you! Your review has been posted successfully.",
      data: newReview,
    });
  } catch (error) {
    console.error("Error posting review:", error);
    if (error.code === "23505") {
      // Handle constraint violation
      return res.status(409).json({
        error: "Review submission failed",
        message: "You have already submitted a review for this tour.",
      });
    }
    res.status(500).json({
      error: "Review submission failed",
      message: "We encountered an error while posting your review.",
    });
  }
});

// Update a review written by user
reviewsRouter.put(
  "/:reviewId",
  validateRequest(reviewSchema),
  async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { rating, content } = req.validatedData;

      let updatedReview;
      await knex.transaction(async (trx) => {
        // ensures a user can only update their own review.
        [updatedReview] = await trx("tour_reviews")
          .where({ id: reviewId, user_id: userId })
          .update({ rating, content })
          .returning("*");

        if (!updatedReview) {
          throw new Error("ReviewNotFound");
        }
        await updateTravelPlanRating(updatedReview.tour_id, trx);
      });

      res.json({
        message: "Your review has been updated successfully.",
        data: updatedReview,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      if (error.message === "ReviewNotFound") {
        return res.status(404).json({
          error: "Update failed",
          message:
            "Review not found, or you do not have permission to update it.",
        });
      }
      res.status(500).json({
        error: "Review update failed",
        message: "We encountered an error while updating your review.",
      });
    }
  }
);

// Delete a review by user
reviewsRouter.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id || req.user.sub;

    await knex.transaction(async (trx) => {
      // Find the review and ensure is owned by the user.
      const reviewToDelete = await trx("tour_reviews")
        .where({ id: reviewId, user_id: userId })
        .first();

      if (!reviewToDelete) {
        throw new Error("ReviewNotFound");
      }

      await trx("tour_reviews").where({ id: reviewId }).del();
      await updateTravelPlanRating(reviewToDelete.tour_id, trx);
    });

    res
      .status(200)
      .json({ message: "Your review has been deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    if (error.message === "ReviewNotFound") {
      return res.status(404).json({
        error: "Deletion failed",
        message:
          "Review not found, or you do not have permission to delete it.",
      });
    }
    res.status(500).json({
      error: "Review deletion failed",
      message: "We encountered an error while deleting your review.",
    });
  }
});

export default reviewsRouter;
