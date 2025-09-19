import express from "express";
import knex from "../../db.mjs";
import { authenticateToken } from "../../middleware/auth.js";

const reviewsRouter = express.Router();

// Apply authentication to all routes
reviewsRouter.use(authenticateToken);

// Get all reviews for admin management with pagination
reviewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    const reviews = await knex("tour_reviews as tr")
      .join("users as u", "tr.user_id", "u.id")
      .join("travel_plans as tp", "tr.tour_id", "tp.id")
      .select(
        "tr.*",
        "u.first_name",
        "u.last_name",
        "u.username",
        "tp.name as tour_name"
      )
      .orderBy("tr.created_at", "desc")
      .limit(limitNum)
      .offset(offsetNum);

    // Get total count for pagination
    const totalCount = await knex("tour_reviews").count("* as count").first();

    // Transform the data to match the expected format
    const transformedReviews = reviews.map(review => ({
      ...review,
      user: {
        first_name: review.first_name,
        last_name: review.last_name,
        username: review.username
      },
      tour: {
        name: review.tour_name
      },
      is_approved: review.status === 'approved'
    }));

    res.json({ 
      message: "Reviews retrieved successfully.", 
      data: transformedReviews,
      pagination: {
        total: parseInt(totalCount.count),
        limit: limitNum,
        offset: offsetNum,
        hasMore: (offsetNum + limitNum) < parseInt(totalCount.count)
      }
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ 
      error: "Failed to retrieve reviews.",
      message: "We encountered an error while loading reviews."
    });
  }
});

// Toggle review approval status
reviewsRouter.put("/:reviewId/toggle-approval", async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Get current approval status
    const review = await knex("tour_reviews")
      .where({ id: reviewId })
      .first();

    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Toggle approval status
    const newStatus = review.status === 'approved' ? 'pending' : 'approved';
    
    const [updatedReview] = await knex("tour_reviews")
      .where({ id: reviewId })
      .update({ status: newStatus })
      .returning("*");

    res.json({
      message: `Review ${newStatus === 'approved' ? 'approved' : 'unapproved'} successfully.`,
      data: updatedReview
    });
  } catch (error) {
    console.error("Error toggling review approval:", error);
    res.status(500).json({ error: "Failed to update review approval status." });
  }
});

// Delete a review (admin)
reviewsRouter.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedCount = await knex("tour_reviews")
      .where({ id: reviewId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review." });
  }
});

export default reviewsRouter;
