import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import tripDestinationsRouter from "./tripDestinations.js";
import tripAccommodationsRouter from "./tripAccommodations.js";
import tripFlightsRouter from "./tripFlights.js";

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateToken);

// --- Main Trip Routes ---

// GET / - Get all trips for the current user
router.get("/", async (req, res) => {
  const userId = req.user.id || req.user.sub;
  try {
    const trips = await knex("travel_plans")
      .where({ owner_id: userId, plan_type: "user" })
      .orderBy("created_at", "desc");

    res.json({
      message: "User trips retrieved successfully.",
      data: trips,
    });
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ error: "Failed to retrieve user trips." });
  }
});

// GET a single trip by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    const trip = await knex("travel_plans")
      .where({ id, owner_id: userId, plan_type: "user" })
      .first();

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or you do not have permission." });
    }

    // load related data
    const [destinations, accommodations, flights] = await Promise.all([
      knex("tour_destinations")
        .where("tour_id", id)
        .orderBy("stop_order", "asc"),
      knex("tour_accommodations").where("tour_id", id),
      knex("tour_flights").where("tour_id", id),
    ]);

    res.json({
      message: "Trip retrieved successfully.",
      data: { ...trip, destinations, accommodations, flights },
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to retrieve trip." });
  }
});

// POST a new trip
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!name) {
    return res.status(400).json({ error: "Trip name is required." });
  }

  try {
    const [newTrip] = await knex("travel_plans")
      .insert({
        name,
        description,
        owner_id: userId,
        plan_type: "user",
      })
      .returning("*");

    res.status(201).json({
      message: "Trip created successfully.",
      data: newTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip." });
  }
});

// PUT (update) a trip
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;
  const { name, description, start_date, duration_days } = req.body;

  try {
    const [updatedTrip] = await knex("travel_plans")
      .where({ id, owner_id: userId, plan_type: "user" })
      .update({
        name,
        description,
        start_date,
        duration_days,
      })
      .returning("*");

    if (!updatedTrip) {
      return res
        .status(404)
        .json({ error: "Trip not found or you do not have permission." });
    }

    res.json({
      message: "Trip updated successfully.",
      data: updatedTrip,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Failed to update trip." });
  }
});

// DELETE a trip
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    await knex.transaction(async (trx) => {
      const trip = await trx("travel_plans")
        .where({ id, owner_id: userId, plan_type: "user" })
        .first();

      if (!trip) {
        throw new Error("TripNotFound");
      }

      // Delete all related items
      await trx("tour_destinations").where("tour_id", id).del();
      await trx("tour_accommodations").where("tour_id", id).del();
      await trx("tour_flights").where("tour_id", id).del();
      await trx("travel_plans").where({ id }).del();
    });

    res.status(200).json({ message: "Trip deleted successfully." });
  } catch (error) {
    if (error.message === "TripNotFound") {
      return res
        .status(404)
        .json({ error: "Trip not found or you do not have permission." });
    }
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip." });
  }
});

// --- Nested Routers ---
router.use("/:tripId/destinations", tripDestinationsRouter);
router.use("/:tripId/accommodations", tripAccommodationsRouter);
router.use("/:tripId/flights", tripFlightsRouter);

export default router;
