import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);

// Helper to check ownership of the parent trip
const checkTripOwnership = async (req, res, next) => {
  const { tripId } = req.params;
  const userId = req.user.id || req.user.sub;
  const trip = await knex("travel_plans")
    .where({ id: tripId, owner_id: userId })
    .first();
  if (!trip) {
    return res
      .status(404)
      .json({ error: "Trip not found or you do not have permission." });
  }
  req.trip = trip; // Pass the trip to the next handler
  next();
};

// POST a new destination to a trip
router.post("/", checkTripOwnership, async (req, res) => {
  const { tripId } = req.params;
  const { city_name, country_name, duration_days, stop_order } = req.body;

  if (!city_name || !country_name || !duration_days || !stop_order) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const [newDestination] = await knex("tour_destinations")
      .insert({
        tour_id: tripId,
        city_name,
        country_name,
        duration_days,
        stop_order,
      })
      .returning("*");
    res.status(201).json({
      message: "Destination added successfully.",
      data: newDestination,
    });
  } catch (error) {
    console.error("Error adding destination:", error);
    res.status(500).json({ error: "Failed to add destination." });
  }
});

// DELETE a destination from a trip
router.delete("/:destinationId", checkTripOwnership, async (req, res) => {
  const { tripId, destinationId } = req.params;

  try {
    const deleteCount = await knex("tour_destinations")
      .where({ id: destinationId, tour_id: tripId })
      .del();

    if (deleteCount === 0) {
      return res.status(404).json({ error: "Destination not found." });
    }

    res.status(200).json({ message: "Destination removed successfully." });
  } catch (error) {
    console.error("Error removing destination:", error);
    res.status(500).json({ error: "Failed to remove destination." });
  }
});

export default router;
