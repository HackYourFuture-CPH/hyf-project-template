import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const adminFlightsRouter = express.Router({ mergeParams: true });
adminFlightsRouter.use(authenticateToken, requireRole(["admin"]));

// POST /api/admin/tours/:tourId/flights - Add a flight to a tour
adminFlightsRouter.post("/", async (req, res) => {
  try {
    const { tourId } = req.params;
    const {
      departs_from_destination_id,
      arrives_at_destination_id,
      airline,
      flight_number,
    } = req.body;

    if (
      !departs_from_destination_id ||
      !arrives_at_destination_id ||
      !airline
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields for flight." });
    }

    const [newFlight] = await knex("tour_flights")
      .insert({
        tour_id: tourId,
        departs_from_destination_id,
        arrives_at_destination_id,
        airline,
        flight_number,
      })
      .returning("*");

    res
      .status(201)
      .json({ message: "Flight added successfully.", data: newFlight });
  } catch (error) {
    console.error("Admin error adding flight:", error);
    res.status(500).json({ error: "Failed to add flight." });
  }
});

// PUT /api/admin/tours/:tourId/flights/:flightId - Update a flight
adminFlightsRouter.put("/:flightId", async (req, res) => {
  try {
    const { flightId } = req.params;
    const [updatedFlight] = await knex("tour_flights")
      .where({ id: flightId })
      .update(req.body, ["id", "airline", "flight_number"]);

    if (!updatedFlight) {
      return res.status(404).json({ error: "Flight not found." });
    }
    res
      .status(200)
      .json({ message: "Flight updated successfully.", data: updatedFlight });
  } catch (error) {
    console.error("Admin error updating flight:", error);
    res.status(500).json({ error: "Failed to update flight." });
  }
});

// DELETE /api/admin/tours/:tourId/flights/:flightId - Remove a flight
adminFlightsRouter.delete("/:flightId", async (req, res) => {
  try {
    const { flightId } = req.params;
    const count = await knex("tour_flights").where({ id: flightId }).del();

    if (count === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }
    res.status(200).json({ message: "Flight removed successfully." });
  } catch (error) {
    console.error("Admin error deleting flight:", error);
    res.status(500).json({ error: "Failed to delete flight." });
  }
});

export default adminFlightsRouter;
