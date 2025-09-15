import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { z } from "zod";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();

router.use(authenticateToken);

// --- Zod Schemas for Booking Validation ---
const tourBookingSchema = z.object({
  tour_id: z.string().uuid("A valid tour ID is required."),
  num_travelers: z
    .number()
    .int()
    .min(1, "You must book for at least one traveler."),
});

const customTripBookingSchema = z.object({
  trip_id: z.string().uuid("A valid trip ID is required."),
  num_travelers: z
    .number()
    .int()
    .min(1, "You must book for at least one traveler."),
});

// --- Booking Routes ---

// This endpoint is for booking a pre-defined tour
router.post("/tour", validateRequest(tourBookingSchema), async (req, res) => {
  const userId = req.user.id || req.user.sub;
  const { tour_id, num_travelers } = req.validatedData;

  try {
    let newBooking;
    await knex.transaction(async (trx) => {
      const tour = await trx("travel_plans")
        .where({ id: tour_id, plan_type: "tour" })
        .forUpdate()
        .first();
      if (!tour) {
        return res
          .status(404)
          .json({ error: "The requested tour does not exist." });
      }

      const bookings = await trx("tour_bookings").where({ tour_id });
      const bookedSpots = bookings.reduce(
        (sum, booking) => sum + booking.num_travelers,
        0
      );
      if (bookedSpots + num_travelers > tour.capacity) {
        return res.status(409).json({
          error: "Sorry, there are not enough available spots on this tour.",
        });
      }

      const totalPrice = tour.price_minor * num_travelers;
      [newBooking] = await trx("tour_bookings")
        .insert({
          user_id: userId,
          tour_id,
          num_travelers,
          total_price_minor: totalPrice,
        })
        .returning("*");
    });

    if (newBooking) {
      res
        .status(201)
        .json({ message: "Tour successfully booked!", data: newBooking });
    }
  } catch (error) {
    console.error("Error booking tour:", error);
    if (!res.headersSent) {
      // Handle unique constraint (user already booked this tour)
      // Postgres unique_violation error code is '23505'
      if (error && (error.code === "23505" || error.code === 23505)) {
        return res.status(409).json({ error: "You have already booked this tour." });
      }
      res.status(500).json({ error: "An error occurred while booking the tour." });
    }
  }
});

// This endpoint is for booking a user-created custom trip
router.post(
  "/custom-trip",
  validateRequest(customTripBookingSchema),
  async (req, res) => {
    const userId = req.user.id || req.user.sub;
    const { trip_id, num_travelers } = req.validatedData;

    try {
      let newBooking;
      await knex.transaction(async (trx) => {
        const trip = await trx("travel_plans")
          .where({ id: trip_id, owner_id: userId, plan_type: "user" })
          .first();
        if (!trip) {
          return res.status(404).json({
            error: "Custom trip not found or you do not have permission.",
          });
        }

        const accommodations = await trx("tour_accommodations as ta")
          .join("accommodations as a", "ta.accommodation_id", "a.id")
          .where("ta.trip_id", trip_id)
          .sum("a.price_per_night_minor as total");
        const flights = await trx("tour_flights as tf")
          .join("flights as f", "tf.flight_id", "f.id")
          .where("tf.trip_id", trip_id)
          .sum("f.price_minor as total");

        const finalPrice =
          ((accommodations[0].total || 0) + (flights[0].total || 0)) *
          num_travelers;

        [newBooking] = await trx("custom_trip_bookings")
          .insert({
            user_id: userId,
            trip_id,
            num_travelers,
            total_price_minor: finalPrice,
          })
          .returning("*");
      });

      if (newBooking) {
        res.status(201).json({
          message: "Your custom trip has been successfully reserved!",
          data: newBooking,
        });
      }
    } catch (error) {
      console.error("Error booking custom trip:", error);
      if (!res.headersSent)
        res
          .status(500)
          .json({ error: "An error occurred while reserving your trip." });
    }
  }
);

// This gets all of a user's bookings, both tours and custom trips
router.get("/my-bookings", async (req, res) => {
  const userId = req.user.id || req.user.sub;
  try {
    const tourBookings = await knex("tour_bookings as tb")
      .join("travel_plans as tp", "tb.tour_id", "tp.id")
      .select(
        "tb.id as booking_id",
        "tp.name as trip_name",
        "tb.booked_at",
        "tp.plan_type"
      )
      .where("tb.user_id", userId);

    const customTripBookings = await knex("custom_trip_bookings as ctb")
      .join("travel_plans as tp", "ctb.trip_id", "tp.id")
      .select(
        "ctb.id as booking_id",
        "tp.name as trip_name",
        "ctb.booked_at",
        "tp.plan_type"
      )
      .where("ctb.user_id", userId);

    const allBookings = [...tourBookings, ...customTripBookings].sort(
      (a, b) => new Date(b.booked_at) - new Date(a.booked_at)
    );

    res.json({
      message: "Your bookings have been retrieved successfully.",
      data: allBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to retrieve your bookings." });
  }
});

export default router;
