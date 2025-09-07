import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

// Correctly named router for clarity.
const adminDestinationsRouter = express.Router({ mergeParams: true });
adminDestinationsRouter.use(authenticateToken, requireRole(["admin"]));

// POST /api/admin/tours/:tourId/destinations - Add a destination to a tour
adminDestinationsRouter.post("/", async (req, res) => {
  try {
    const { tourId } = req.params;
    const { city_name, country_name, duration_days } = req.body;

    if (!city_name || !country_name || !duration_days) {
      return res
        .status(400)
        .json({ error: "Missing required fields for destination." });
    }

    const lastStop = await knex("tour_destinations")
      .where({ tour_id: tourId })
      .orderBy("stop_order", "desc")
      .first();

    const newStopOrder = lastStop ? lastStop.stop_order + 1 : 1;

    const [newDestination] = await knex("tour_destinations")
      .insert({
        tour_id: tourId,
        city_name,
        country_name,
        duration_days,
        stop_order: newStopOrder,
      })
      .returning("*");

    res
      .status(201)
      .json({
        message: "Destination added successfully.",
        data: newDestination,
      });
  } catch (error) {
    console.error("Admin error adding destination:", error);
    res.status(500).json({ error: "Failed to add destination." });
  }
});

// PUT /api/admin/tours/:tourId/destinations/:destinationId - Update a destination
adminDestinationsRouter.put("/:destinationId", async (req, res) => {
  try {
    const { destinationId } = req.params;
    const [updatedDestination] = await knex("tour_destinations")
      .where({ id: destinationId })
      .update(req.body)
      .returning("*");

    if (!updatedDestination) {
      return res.status(404).json({ error: "Destination not found." });
    }
    res
      .status(200)
      .json({
        message: "Destination updated successfully.",
        data: updatedDestination,
      });
  } catch (error) {
    console.error("Admin error updating destination:", error);
    res.status(500).json({ error: "Failed to update destination." });
  }
});

// DELETE /api/admin/tours/:tourId/destinations/:destinationId - Remove a destination
adminDestinationsRouter.delete("/:destinationId", async (req, res) => {
  try {
    const { destinationId } = req.params;
    const count = await knex("tour_destinations")
      .where({ id: destinationId })
      .del();

    if (count === 0) {
      return res.status(404).json({ error: "Destination not found." });
    }
    res.status(200).json({ message: "Destination removed successfully." });
  } catch (error) {
    console.error("Admin error deleting destination:", error);
    res.status(500).json({ error: "Failed to delete destination." });
  }
});

export default adminDestinationsRouter;
