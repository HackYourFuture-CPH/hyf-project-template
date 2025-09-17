import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import tripDestinationsRouter from "./tripDestinations.js";
import tripAccommodationsRouter from "./tripAccommodations.js";
import tripFlightsRouter from "./tripFlights.js";
import { randomBytes } from "crypto";
import aiPlannerRouter from "./aiPlanner.js";
import shortlistRouter from "./shortlist.js";
import itineraryRouter from "./itinerary.js";
import chatRouter from "./chat.js";

const router = express.Router();
router.use(authenticateToken);

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

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;
  try {
    const trip = await knex("travel_plans").where({ id }).first();

    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    const isOwner = trip.owner_id === userId;
    const isCollaborator = await knex("trip_collaborators")
      .where({ trip_id: id, user_id: userId })
      .first();

    if (!isOwner && !isCollaborator) {
      return res
        .status(403)
        .json({ error: "You do not have permission to view this trip." });
    }

    const [destinations, accommodations, flights, collaborators] =
      await Promise.all([
        knex("tour_destinations")
          .where("tour_id", id)
          .orderBy("stop_order", "asc"),
        knex("tour_accommodations").where("tour_id", id),
        knex("tour_flights").where("tour_id", id),
        knex("trip_collaborators as tc")
          .join("users as u", "tc.user_id", "u.id")
          .select("u.id", "u.first_name", "u.last_name")
          .where("tc.trip_id", id),
      ]);

    res.json({
      message: "Trip retrieved successfully.",
      data: { ...trip, destinations, accommodations, flights, collaborators },
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to retrieve trip." });
  }
});

router.post("/", async (req, res) => {
  const { name, description, destination, startDate, endDate } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!name || !destination || !startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Trip name, destination, and dates are required." });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  try {
    let newTrip;
    await knex.transaction(async (trx) => {
      const [tripRecord] = await trx("travel_plans")
        .insert({
          name,
          description: description || `A trip to ${destination}`,
          owner_id: userId,
          plan_type: "user",
          start_date: startDate,
          duration_days: duration_days > 0 ? duration_days : 1,
        })
        .returning("*");

      const [city_name, country_name] = destination
        .split(",")
        .map((s) => s.trim());

      await trx("tour_destinations").insert({
        tour_id: tripRecord.id,
        city_name: city_name || "Unknown",
        country_name: country_name || "Unknown",
        stop_order: 1,
        duration_days: duration_days > 0 ? duration_days : 1,
      });

      await trx("trip_collaborators").insert({
        trip_id: tripRecord.id,
        user_id: userId,
        permission_level: "editor",
      });

      newTrip = tripRecord;
    });

    res
      .status(201)
      .json({ message: "Trip created successfully.", data: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip." });
  }
});

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
          const accommodationsToLink = await trx("accommodations").whereIn(
            "id",
            dest.accommodation_ids
          );
          const accommodationData = accommodationsToLink.map((acc) => ({
            tour_id: tripRecord.id,
            destination_id: newDestination.id,
            name: acc.name,
            type: acc.type,
            rating: acc.rating,
            price_minor: acc.price_per_night_minor,
            currency_code: acc.currency_code,
          }));
          if (accommodationData.length > 0) {
            await trx("tour_accommodations").insert(accommodationData);
          }
        }

        if (dest.flight_ids && dest.flight_ids.length > 0) {
          const flightsToLink = await trx("flights").whereIn(
            "id",
            dest.flight_ids
          );
          const flightData = flightsToLink.map((flight) => ({
            tour_id: tripRecord.id,
            departs_from_destination_id: newDestination.id,
            arrives_at_destination_id: newDestination.id,
            airline: flight.airline,
            flight_number: flight.flight_number,
            price_minor: flight.price_minor,
            currency_code: flight.currency_code,
          }));
          if (flightData.length > 0) {
            await trx("tour_flights").insert(flightData);
          }
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;
  const {
    name,
    description,
    start_date,
    duration_days,
    cover_image_url,
    selected_accommodation_id,
    selected_flight_id,
  } = req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (start_date) updateData.start_date = start_date;
    if (duration_days) updateData.duration_days = duration_days;
    if (cover_image_url) updateData.cover_image_url = cover_image_url;
    if (selected_accommodation_id)
      updateData.selected_accommodation_id = selected_accommodation_id;
    if (selected_flight_id) updateData.selected_flight_id = selected_flight_id;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update data provided." });
    }

    const [updatedTrip] = await knex("travel_plans")
      .where({ id, owner_id: userId, plan_type: "user" })
      .update(updateData)
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

router.post("/:tripId/invitations", async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    const trip = await knex("travel_plans")
      .where({ id: tripId, owner_id: userId })
      .first();
    if (!trip) {
      return res.status(403).json({
        error:
          "Permission denied. Only the trip owner can create invitation links.",
      });
    }

    const token = randomBytes(20).toString("hex");
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await knex("trip_invitations").insert({
      trip_id: tripId,
      created_by_user_id: userId,
      token,
      expires_at,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const shareableLink = `${frontendUrl}/join-trip?token=${token}`;
    res.status(201).json({ shareableLink });
  } catch (error) {
    console.error("Error creating invitation link:", error);
    res.status(500).json({ error: "Failed to create invitation link." });
  }
});

router.use("/:tripId/ai-suggestions", aiPlannerRouter);
router.use("/:tripId/shortlist", shortlistRouter);
router.use("/:tripId/itinerary", itineraryRouter);
router.use("/:tripId/chat", chatRouter);
router.use("/:tripId/destinations", tripDestinationsRouter);
router.use("/:tripId/accommodations", tripAccommodationsRouter);
router.use("/:tripId/flights", tripFlightsRouter);

export default router;
