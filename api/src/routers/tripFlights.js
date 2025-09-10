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

// POST a new flight to a trip
router.post("/", checkTripOwnership, async (req, res) => {
  const { tripId } = req.params;
  const {
    departs_from_destination_id,
    arrives_at_destination_id,
    airline,
    flight_number,
  } = req.body;

  if (!departs_from_destination_id || !arrives_at_destination_id) {
    return res
      .status(400)
      .json({ error: "Missing departure or arrival destination." });
  }

  try {
    const [newFlight] = await knex("tour_flights")
      .insert({
        tour_id: tripId,
        departs_from_destination_id,
        arrives_at_destination_id,
        airline,
        flight_number,
      })
      .returning("*");
    res.status(201).json({
      message: "Flight added successfully.",
      data: newFlight,
    });
  } catch (error) {
    console.error("Error adding flight:", error);
    res.status(500).json({ error: "Failed to add flight." });
  }
});

// DELETE a flight from a trip
router.delete("/:flightId", checkTripOwnership, async (req, res) => {
  const { tripId, flightId } = req.params;
  try {
    const deleteCount = await knex("tour_flights")
      .where({ id: flightId, tour_id: tripId })
      .del();
    if (deleteCount === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }
    res.status(200).json({ message: "Flight removed successfully." });
  } catch (error) {
    console.error("Error removing flight:", error);
    res.status(500).json({ error: "Failed to remove flight." });
  }
});

export default router;
