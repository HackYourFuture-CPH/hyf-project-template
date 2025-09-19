import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { z } from "zod";
import { validateRequest } from "../../middleware/validation.js";

const adminBookingsRouter = express.Router();
adminBookingsRouter.use(authenticateToken, requireRole(["admin"]));

// Zod schema for updating a booking's status
const bookingUpdateSchema = z.object({
  booking_status: z.enum(["confirmed", "pending", "cancelled"]),
});

// GET /api/admin/bookings - Get all bookings with filtering and pagination
adminBookingsRouter.get("/", async (req, res) => {
  try {
    const {
      status = "",
      type = "",
      sort = "booked_at-desc",
      page = 1,
      limit = 10,
    } = req.query;

    // Fetch both types of bookings
    const tourBookingsQuery = knex("tour_bookings as tb")
      .join("travel_plans as tp", "tb.tour_id", "tp.id")
      .join("users as u", "tb.user_id", "u.id")
      .select(
        "tb.id as booking_id",
        "tp.name as trip_name",
        "tb.booking_status",
        "tb.booked_at",
        knex.raw("'tour' as booking_type"),
        "u.username"
      );

    const customTripBookingsQuery = knex("custom_trip_bookings as ctb")
      .join("travel_plans as tp", "ctb.trip_id", "tp.id")
      .join("users as u", "ctb.user_id", "u.id")
      .select(
        "ctb.id as booking_id",
        "tp.name as trip_name",
        "ctb.booking_status",
        "ctb.booked_at",
        knex.raw("'custom' as booking_type"),
        "u.username"
      );

    // Apply filters
    if (status) {
      tourBookingsQuery.where("tb.booking_status", status);
      customTripBookingsQuery.where("ctb.booking_status", status);
    }

    let bookings;
    if (type === "tour") {
      bookings = await tourBookingsQuery;
    } else if (type === "custom") {
      bookings = await customTripBookingsQuery;
    } else {
      const tourBookings = await tourBookingsQuery;
      const customTripBookings = await customTripBookingsQuery;
      bookings = [...tourBookings, ...customTripBookings];
    }

    // Sort combined results
    const [sortField, sortOrder] = sort.split("-");
    bookings.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Paginate combined results
    const total = bookings.length;
    const offset = (page - 1) * limit;
    const paginatedBookings = bookings.slice(offset, offset + limit);

    res.json({
      message: "All bookings retrieved successfully.",
      data: paginatedBookings,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Admin error fetching bookings:", error);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

// PUT /api/admin/bookings/:type/:id - Update a booking's status
adminBookingsRouter.put(
  "/:type/:id",
  validateRequest(bookingUpdateSchema),
  async (req, res) => {
    try {
      const { type, id } = req.params;
      const { booking_status } = req.validatedData;

      const tableName =
        type === "tour" ? "tour_bookings" : "custom_trip_bookings";

      const [updatedBooking] = await knex(tableName)
        .where({ id })
        .update({ booking_status })
        .returning("*");

      if (!updatedBooking) {
        return res.status(404).json({ error: "Booking not found." });
      }

      res.json({
        message: "Booking status updated successfully.",
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Admin error updating booking:", error);
      res.status(500).json({ error: "Failed to update booking." });
    }
  }
);

export default adminBookingsRouter;
