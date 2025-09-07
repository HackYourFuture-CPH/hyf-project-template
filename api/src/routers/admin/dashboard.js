import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const adminDashboardRouter = express.Router();
adminDashboardRouter.use(authenticateToken, requireRole(["admin"]));

adminDashboardRouter.get("/stats", async (req, res) => {
  try {
    // Fetch all counts in parallel for better performance.
    const [userCount, tourCount, postCount, reviewCount] = await Promise.all([
      knex("users").count("* as count").first(),
      knex("travel_plans")
        .where({ plan_type: "tour" })
        .count("* as count")
        .first(),
      knex("user_posts").count("* as count").first(),
      knex("tour_reviews").count("* as count").first(),
    ]);

    res.json({
      message: "Admin dashboard statistics retrieved successfully.",
      data: {
        total_users: parseInt(userCount.count),
        total_tours: parseInt(tourCount.count),
        total_posts: parseInt(postCount.count),
        total_reviews: parseInt(reviewCount.count),
      },
    });
  } catch (error) {
    console.error("Admin error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to retrieve dashboard statistics." });
  }
});

export default adminDashboardRouter;
