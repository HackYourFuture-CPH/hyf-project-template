import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import tripDestinationsRouter from "./tripDestinations.js";
import tripAccommodationsRouter from "./tripAccommodations.js";
import tripFlightsRouter from "./tripFlights.js";

const router = express.Router();

router.use(authenticateToken);

// GET all trips for the current user
router.get("/", async (req, res) => {
  const userId = req.user.id || req.user.sub;
  try {
    const trips = await knex("travel_plans")
      .where({ owner_id: userId, plan_type: "user" })
      .orderBy("created_at", "desc");
    res.json({ message: "Your trips retrieved successfully.", data: trips });
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ error: "Failed to retrieve your trips." });
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
    const [destinations, accommodations, flights] = await Promise.all([
      knex("tour_destinations")
        .where("tour_id", id)
        .orderBy("stop_order", "asc"),
      knex("tour_accommodations as ta")
        .join("accommodations as a", "ta.accommodation_id", "a.id")
        .where("ta.trip_id", id)
        .select("a.*"),
      knex("tour_flights as tf")
        .join("flights as f", "tf.flight_id", "f.id")
        .where("tf.trip_id", id)
        .select("f.*"),
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

// POST a new, empty trip plan
router.post("/", async (req, res) => {
  const { name, description, cover_image_url } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!name) {
    return res.status(400).json({ error: "Trip name is required." });
  }
  try {
    const [newTrip] = await knex("travel_plans")
      .insert({
        name,
        description,
        cover_image_url,
        owner_id: userId,
        plan_type: "user",
      })
      .returning("*");
    res
      .status(201)
      .json({ message: "Trip created successfully.", data: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip." });
  }
});

// NEW: This is the route for creating a complete custom trip with all its parts.
router.post("/build", async (req, res) => {
  const userId = req.user.id || req.user.sub;
  const { name, description, destinations } = req.body;

  if (
    !name ||
    !destinations ||
    !Array.isArray(destinations) ||
    destinations.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Trip name and at least one destination are required." });
  }

  try {
    let newTrip;
    await knex.transaction(async (trx) => {
      const [tripRecord] = await trx("travel_plans")
        .insert({ name, description, owner_id: userId, plan_type: "user" })
        .returning("*");

      for (const dest of destinations) {
        const [newDestination] = await trx("tour_destinations")
          .insert({
            tour_id: tripRecord.id,
            city_name: dest.city_name,
            country_name: dest.country_name,
            stop_order: dest.stop_order,
            duration_days: dest.duration_days,
          })
          .returning("id");

        if (dest.accommodation_ids && dest.accommodation_ids.length > 0) {
          const accommodationLinks = dest.accommodation_ids.map((accId) => ({
            trip_id: tripRecord.id,
            accommodation_id: accId,
            destination_id: newDestination.id,
          }));
          await trx("tour_accommodations").insert(accommodationLinks);
        }

        if (dest.flight_ids && dest.flight_ids.length > 0) {
          const flightLinks = dest.flight_ids.map((flightId) => ({
            trip_id: tripRecord.id,
            flight_id: flightId,
            destination_id: newDestination.id,
          }));
          await trx("tour_flights").insert(flightLinks);
        }
      }
      newTrip = tripRecord;
    });

    if (newTrip) {
      res
        .status(201)
        .json({ message: "Custom trip created successfully!", data: newTrip });
    }
  } catch (error) {
    console.error("Error creating custom trip:", error);
    res.status(500).json({ error: "Failed to create your custom trip." });
  }
});

// PUT (update) a trip
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;
  const { name, description, start_date, duration_days, cover_image_url } =
    req.body;

  try {
    const [updatedTrip] = await knex("travel_plans")
      .where({ id, owner_id: userId, plan_type: "user" })
      .update({ name, description, start_date, duration_days, cover_image_url })
      .returning("*");
    if (!updatedTrip) {
      return res
        .status(404)
        .json({ error: "Trip not found or you do not have permission." });
    }
    res.json({ message: "Trip updated successfully.", data: updatedTrip });
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
      // Delete from all related tables
      await trx("tour_destinations").where("tour_id", id).del();
      await trx("tour_accommodations").where("trip_id", id).del();
      await trx("tour_flights").where("trip_id", id).del();
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

// Nested Routers for trip details
router.use("/:tripId/destinations", tripDestinationsRouter);
router.use("/:tripId/accommodations", tripAccommodationsRouter);
router.use("/:tripId/flights", tripFlightsRouter);

export default router;
