import express from "express";
import knex from "../db.mjs";
import reviewsRouter from "./reviews.js";

const router = express.Router();

// GET /api/tours - Get all tours with search, filtering, and sorting
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      sort = "name-asc",
      page = 1,
      limit = 9,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      currency, // **FIX 1:** Removed ' = "USD" ' default to make currency filter optional.
    } = req.query;

    // Build the base query
    let query = knex("travel_plans as tp")
      .select(
        "tp.id",
        "tp.name",
        "tp.description",
        "tp.duration_days",
        "tp.price_minor",
        "tp.currency_code",
        "tp.capacity",
        "tp.cover_image_url",
        "tp.rating",
        "tp.rating_count",
        "c.symbol as currency_symbol"
      )
      .leftJoin("currencies as c", "tp.currency_code", "c.code")
      .where("tp.plan_type", "tour");

    // Apply search filter
    if (search) {
      query = query.where(function () {
        this.where("tp.name", "ilike", `%${search}%`)
          .orWhere("tp.description", "ilike", `%${search}%`)
          .orWhereExists(function () {
            this.select(1)
              .from("tour_destinations as td")
              .whereRaw("td.tour_id = tp.id")
              .andWhere(function () {
                this.where("td.city_name", "ilike", `%${search}%`).orWhere(
                  "td.country_name",
                  "ilike",
                  `%${search}%`
                );
              });
          });
      });
    }

    // Apply price filters
    if (minPrice !== undefined) {
      query = query.where("tp.price_minor", ">=", parseInt(minPrice));
    }
    if (maxPrice !== undefined) {
      query = query.where("tp.price_minor", "<=", parseInt(maxPrice));
    }

    // Apply duration filters
    if (minDuration !== undefined) {
      query = query.where("tp.duration_days", ">=", parseInt(minDuration));
    }
    if (maxDuration !== undefined) {
      query = query.where("tp.duration_days", "<=", parseInt(maxDuration));
    }

    // Apply currency filter
    if (currency) {
      query = query.where("tp.currency_code", currency);
    }

    // Get total count for pagination
    const countQuery = query
      .clone()
      .clearSelect()
      .clearOrder()
      .count("* as count")
      .first();
    const totalItems = await countQuery;
    const total = parseInt(totalItems.count);

    // Apply sorting
    const [sortField, sortOrder] = sort.split("-");
    const validSortFields = [
      "name",
      "price_minor",
      "duration_days",
      "rating",
      "created_at",
    ];
    const validSortOrders = ["asc", "desc"];

    if (
      validSortFields.includes(sortField) &&
      validSortOrders.includes(sortOrder)
    ) {
      query = query.orderBy(`tp.${sortField}`, sortOrder);
    } else {
      // Default sorting
      query = query.orderBy("tp.name", "asc");
    }

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.offset(offset).limit(parseInt(limit));

    // Execute the query
    const tours = await query;

    // Transform the data to match the expected response format
    const transformedTours = tours.map((tour) => ({
      id: tour.id,
      name: tour.name,
      destination: tour.description, // Using description as destination for now
      price_usd: tour.price_minor, // This should be converted to USD in production
      duration_days: tour.duration_days,
      cover_image_url: tour.cover_image_url,
      average_rating: tour.rating,
      currency_code: tour.currency_code,
      currency_symbol: tour.currency_symbol,
      capacity: tour.capacity,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const currentPage = parseInt(page);

    res.json({
      totalItems: total,
      totalPages,
      currentPage,
      tours: transformedTours,
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch tours",
    });
  }
});

// GET /api/tours/:id - Get a specific tour by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await knex("travel_plans as tp")
      .select("tp.*", "c.symbol as currency_symbol", "c.name as currency_name")
      .leftJoin("currencies as c", "tp.currency_code", "c.code")
      .where("tp.id", id)
      .where("tp.plan_type", "tour")
      .first();

    if (!tour) {
      return res.status(404).json({
        error: "Tour not found",
        message: "The requested tour does not exist",
      });
    }

    // **FIX 3:** Replaced sequential awaits with Promise.all for better performance.
    const [destinations, accommodations, flights, reviews] = await Promise.all([
      knex("tour_destinations")
        .where("tour_id", id)
        .orderBy("stop_order", "asc"),
      knex("tour_accommodations").where("tour_id", id),
      knex("tour_flights").where("tour_id", id),
      knex("tour_reviews as tr")
        .select("tr.*", "u.first_name", "u.last_name", "u.profile_image")
        .leftJoin("users as u", "tr.user_id", "u.id")
        .where("tr.tour_id", id)
        .orderBy("tr.created_at", "desc"),
    ]);

    res.json({
      ...tour,
      destinations,
      accommodations,
      flights,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch tour details",
    });
  }
});

// POST /api/tours - Create a new tour
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      duration_days,
      price_minor,
      currency_code,
      capacity,
      cover_image_url,
      destinations,
    } = req.body;

    if (
      !name ||
      !description ||
      !duration_days ||
      !price_minor ||
      !currency_code ||
      !capacity
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        message:
          "Name, description, duration_days, price_minor, currency_code, and capacity are required",
      });
    }

    const currency = await knex("currencies")
      .where("code", currency_code)
      .first();
    if (!currency) {
      return res.status(400).json({
        error: "Invalid currency",
        message: "The specified currency code does not exist",
      });
    }

    // **FIX 2:** Replaced manual transaction handling with a safer block pattern.
    // Added a check for destinations.length to prevent empty query error.
    await knex.transaction(async (trx) => {
      const [tour] = await trx("travel_plans")
        .insert({
          name,
          description,
          start_date: start_date ? new Date(start_date) : null,
          duration_days,
          price_minor,
          currency_code,
          capacity,
          cover_image_url,
          plan_type: "tour",
        })
        .returning("*");

      if (
        destinations &&
        Array.isArray(destinations) &&
        destinations.length > 0
      ) {
        const destinationData = destinations.map((dest, index) => ({
          tour_id: tour.id,
          city_name: dest.city_name,
          country_name: dest.country_name,
          stop_order: index + 1,
          duration_days:
            dest.duration_days ||
            Math.ceil(duration_days / destinations.length),
        }));

        await trx("tour_destinations").insert(destinationData);
      }

      const newTour = await trx("travel_plans as tp")
        .select("tp.*", "c.symbol as currency_symbol")
        .leftJoin("currencies as c", "tp.currency_code", "c.code")
        .where("tp.id", tour.id)
        .first();

      res.status(201).json({
        message: "Tour created successfully",
        tour: {
          id: newTour.id,
          name: newTour.name,
          destination: newTour.description,
          price_usd: newTour.price_minor,
          duration_days: newTour.duration_days,
          cover_image_url: newTour.cover_image_url,
          average_rating: newTour.rating,
          currency_code: newTour.currency_code,
          currency_symbol: newTour.currency_symbol,
          capacity: newTour.capacity,
        },
      });
    });
  } catch (error) {
    console.error("Error creating tour:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to create tour",
      });
    }
  }
});

// PUT /api/tours/:id - Update a tour
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      start_date,
      duration_days,
      price_minor,
      currency_code,
      capacity,
      cover_image_url,
      destinations,
    } = req.body;

    const existingTour = await knex("travel_plans")
      .where({ id, plan_type: "tour" })
      .first();

    if (!existingTour) {
      return res.status(404).json({
        error: "Tour not found",
        message: "The requested tour does not exist",
      });
    }

    if (currency_code) {
      const currency = await knex("currencies")
        .where("code", currency_code)
        .first();
      if (!currency) {
        return res.status(400).json({
          error: "Invalid currency",
          message: "The specified currency code does not exist",
        });
      }
    }

    await knex.transaction(async (trx) => {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (start_date !== undefined)
        updateData.start_date = start_date ? new Date(start_date) : null;
      if (duration_days !== undefined) updateData.duration_days = duration_days;
      if (price_minor !== undefined) updateData.price_minor = price_minor;
      if (currency_code !== undefined) updateData.currency_code = currency_code;
      if (capacity !== undefined) updateData.capacity = capacity;
      if (cover_image_url !== undefined)
        updateData.cover_image_url = cover_image_url;

      if (Object.keys(updateData).length > 0) {
        await trx("travel_plans").where("id", id).update(updateData);
      }

      if (destinations && Array.isArray(destinations)) {
        await trx("tour_destinations").where("tour_id", id).del();
        if (destinations.length > 0) {
          const destinationData = destinations.map((dest, index) => ({
            tour_id: id,
            city_name: dest.city_name,
            country_name: dest.country_name,
            stop_order: index + 1,
            duration_days:
              dest.duration_days ||
              Math.ceil(
                (duration_days || existingTour.duration_days) /
                  destinations.length
              ),
          }));
          await trx("tour_destinations").insert(destinationData);
        }
      }

      const updatedTour = await trx("travel_plans as tp")
        .select("tp.*", "c.symbol as currency_symbol")
        .leftJoin("currencies as c", "tp.currency_code", "c.code")
        .where("tp.id", id)
        .first();

      res.json({
        message: "Tour updated successfully",
        tour: {
          id: updatedTour.id,
          name: updatedTour.name,
          destination: updatedTour.description,
          price_usd: updatedTour.price_minor,
          duration_days: updatedTour.duration_days,
          cover_image_url: updatedTour.cover_image_url,
          average_rating: updatedTour.rating,
          currency_code: updatedTour.currency_code,
          currency_symbol: updatedTour.currency_symbol,
          capacity: updatedTour.capacity,
        },
      });
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to update tour",
      });
    }
  }
});

// DELETE /api/tours/:id - Delete a tour
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingTour = await knex("travel_plans")
      .where({ id, plan_type: "tour" })
      .first();

    if (!existingTour) {
      return res.status(404).json({
        error: "Tour not found",
        message: "The requested tour does not exist",
      });
    }

    // Rely on ON DELETE CASCADE in the database schema.
    // We just need to delete the main tour record.
    const deletedCount = await knex("travel_plans").where({ id }).del();

    if (deletedCount > 0) {
      res.json({
        message: "Tour and all related data deleted successfully.",
      });
    } else {
      // This case is unlikely if the first check passed, but good for safety.
      res.status(404).json({ error: "Tour not found during deletion." });
    }
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete tour",
    });
  }
});

// add review to the tour
router.use("/:id/reviews", reviewsRouter);

export default router;
