import express from "express";
import knex from "../db.mjs";
import { z } from "zod";

const router = express.Router();

// This schema validates the query parameters for our trip planner
const tripOptionsSchema = z.object({
  city: z.string().min(1, "A destination city is required."),
  startDate: z
    .string()
    .datetime({ message: "Start date must be a valid date-time string." }),
  endDate: z
    .string()
    .datetime({ message: "End date must be a valid date-time string." }),
  numPeople: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().min(1, "Number of people must be at least 1.")
  ),
});

// This is our main endpoint for finding trip options
router.get("/", async (req, res) => {
  // We'll validate the query parameters safely inside the route handler
  const validationResult = tripOptionsSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validationResult.error.flatten().fieldErrors,
    });
  }

  const { city, startDate, endDate, numPeople } = validationResult.data;

  try {
    // We'll fetch both lists at the same time for better performance
    const [flights, accommodations] = await Promise.all([
      // Find flights arriving in the right city, within the date range, with enough seats
      knex("flights")
        .where("arrival_city", "ilike", `%${city}%`)
        .andWhere("departure_timestamp", ">=", startDate)
        .andWhere("departure_timestamp", "<=", endDate)
        .andWhere("available_seats", ">=", numPeople),

      // Find hotels in the right city that have rooms big enough for the group.
      knex("accommodations")
        .where("city", "ilike", `%${city}%`)
        .andWhere("capacity_per_room", ">=", numPeople),
    ]);

    res.json({
      message: `Trip options for ${city} retrieved successfully.`,
      data: {
        flights,
        accommodations,
      },
    });
  } catch (error) {
    console.error("Error fetching trip options:", error);
    res.status(500).json({ error: "Failed to retrieve trip options." });
  }
});

export default router;
