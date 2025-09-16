import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const adminTripsRouter = express.Router();
adminTripsRouter.use(authenticateToken, requireRole(["admin"]));

// GET /api/admin/trips - Get all user-created trips
adminTripsRouter.get("/", async (req, res) => {
  try {
    const trips = await knex("travel_plans")
      .where({ plan_type: "user" }) // No owner_id check
      .orderBy("created_at", "desc");
    res.json({
      message: "All user trips retrieved successfully.",
      data: trips,
    });
  } catch (error) {
    console.error("Admin error fetching user trips:", error);
    res.status(500).json({ error: "Failed to retrieve user trips." });
  }
});

// GET /api/admin/trips/:id - Get a single user trip by ID
adminTripsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await knex("travel_plans")
      .where({ id, plan_type: "user" }) // No owner_id check
      .first();
    if (!trip) {
      return res.status(404).json({ error: "User trip not found." });
    }
    // You can also fetch related destinations, etc., just like in the public route
    res.json({ message: "User trip retrieved successfully.", data: trip });
  } catch (error) {
    console.error("Admin error fetching trip:", error);
    res.status(500).json({ error: "Failed to retrieve trip." });
  }
});

// DELETE /api/admin/trips/:id - Delete any user-created trip
adminTripsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await knex("travel_plans")
      .where({ id, plan_type: "user" }) // No owner_id check
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "User trip not found." });
    }
    // Note: For a complete solution, you'd also delete related destinations, etc., in a transaction.
    res.status(200).json({ message: "User trip deleted successfully." });
  } catch (error) {
    console.error("Admin error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip." });
  }
});

export default adminTripsRouter;
