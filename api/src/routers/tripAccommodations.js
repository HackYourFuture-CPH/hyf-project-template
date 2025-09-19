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
  req.trip = trip;
  next();
};

// POST a new accommodation to a destination
router.post("/", checkTripOwnership, async (req, res) => {
  const { tripId } = req.params;
  const { destination_id, name, type, rating } = req.body;

  if (!destination_id || !name) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const [newAccommodation] = await knex("tour_accommodations")
      .insert({
        tour_id: tripId,
        destination_id,
        name,
        type,
        rating,
      })
      .returning("*");
    res.status(201).json({
      message: "Accommodation added successfully.",
      data: newAccommodation,
    });
  } catch (error) {
    console.error("Error adding accommodation:", error);
    res.status(500).json({ error: "Failed to add accommodation." });
  }
});

// DELETE an accommodation
router.delete("/:accommodationId", checkTripOwnership, async (req, res) => {
  const { tripId, accommodationId } = req.params;

  try {
    const deleteCount = await knex("tour_accommodations")
      .where({ id: accommodationId, tour_id: tripId })
      .del();
    if (deleteCount === 0) {
      return res.status(404).json({ error: "Accommodation not found." });
    }
    res.status(200).json({ message: "Accommodation removed successfully." });
  } catch (error) {
    console.error("Error removing accommodation:", error);
    res.status(500).json({ error: "Failed to remove accommodation." });
  }
});

export default router;
