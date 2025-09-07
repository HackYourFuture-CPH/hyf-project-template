import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";
import {
  adminTourCreateSchema,
  adminTourUpdateSchema,
} from "../../validation/schemas.js";
import adminDestinationsRouter from "./destinations.js";
import adminAccommodationsRouter from "./accommodations.js";
import adminFlightsRouter from "./flights.js";

const adminToursRouter = express.Router();
adminToursRouter.use(authenticateToken, requireRole(["admin"]));

// --- Main Tour Routes ---

// GET /api/admin/tours
adminToursRouter.get("/", async (req, res) => {
  try {
    const {
      search = "",
      sort = "created_at-desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = knex("travel_plans").select("*").where({ plan_type: "tour" });
    const countQuery = knex("travel_plans").where({ plan_type: "tour" });

    if (search) {
      const searchTerm = `%${search}%`;
      const searchFilter = (builder) =>
        builder
          .where("name", "ilike", searchTerm)
          .orWhere("description", "ilike", searchTerm);
      query.andWhere(searchFilter);
      countQuery.andWhere(searchFilter);
    }

    const [sortField, sortOrder] = sort.split("-");
    if (
      ["name", "price_minor", "duration_days", "rating", "created_at"].includes(
        sortField
      ) &&
      ["asc", "desc"].includes(sortOrder)
    ) {
      query.orderBy(sortField, sortOrder);
    }

    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    const tours = await query;
    const totalResult = await countQuery.count("* as count").first();
    const total = parseInt(totalResult.count);

    res.json({
      message: "Tours retrieved successfully for admin.",
      data: tours,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Admin error fetching tours:", error);
    res.status(500).json({ error: "Failed to retrieve tours." });
  }
});

// GET /api/admin/tours/:id
adminToursRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await knex("travel_plans")
      .where({ id, plan_type: "tour" })
      .first();

    if (!tour) {
      return res.status(404).json({ error: "Tour not found." });
    }

    const [destinations, accommodations, flights, reviews] = await Promise.all([
      knex("tour_destinations")
        .where("tour_id", id)
        .orderBy("stop_order", "asc"),
      knex("tour_accommodations").where("tour_id", id),
      knex("tour_flights").where("tour_id", id),
      knex("tour_reviews").where("tour_id", id),
    ]);

    res.json({
      message: "Tour details retrieved successfully for admin.",
      data: {
        ...tour,
        cover_image_url: tour.cover_image_url
          ? `${req.protocol}://${req.get("host")}${tour.cover_image_url}`
          : null,
        destinations,
        accommodations,
        flights,
        reviews,
      },
    });
  } catch (error) {
    console.error("Admin error fetching tour details:", error);
    res.status(500).json({ error: "Failed to retrieve tour details." });
  }
});

// POST /api/admin/tours
adminToursRouter.post(
  "/",
  validateRequest(adminTourCreateSchema),
  async (req, res) => {
    try {
      const { destinations, ...tourData } = req.validatedData;
      tourData.plan_type = "tour";

      let newTour;
      await knex.transaction(async (trx) => {
        const [{ id: tourId }] = await trx("travel_plans")
          .insert(tourData)
          .returning("id");

        if (destinations && destinations.length > 0) {
          const destinationData = destinations.map((dest, index) => ({
            ...dest,
            tour_id: tourId,
            stop_order: index + 1,
          }));
          await trx("tour_destinations").insert(destinationData);
        }
        newTour = await trx("travel_plans").where({ id: tourId }).first();
      });

      res
        .status(201)
        .json({
          message: "Tour created successfully by admin.",
          data: newTour,
        });
    } catch (error) {
      console.error("Admin error creating tour:", error);
      res.status(500).json({ error: "Failed to create tour." });
    }
  }
);

// PUT /api/admin/tours/:id
adminToursRouter.put(
  "/:id",
  validateRequest(adminTourUpdateSchema),
  async (req, res) => {
    const { id } = req.params;
    try {
      const { destinations, ...tourData } = req.validatedData;

      let updatedTour;
      await knex.transaction(async (trx) => {
        if (Object.keys(tourData).length > 0) {
          const [result] = await trx("travel_plans")
            .where({ id, plan_type: "tour" })
            .update(tourData)
            .returning("*");
          if (!result) throw new Error("TourNotFound");
        }

        if (destinations) {
          await trx("tour_destinations").where({ tour_id: id }).del();
          if (destinations.length > 0) {
            const destinationData = destinations.map((dest, index) => ({
              ...dest,
              tour_id: id,
              stop_order: index + 1,
            }));
            await trx("tour_destinations").insert(destinationData);
          }
        }
        updatedTour = await trx("travel_plans").where({ id }).first();
      });

      res
        .status(200)
        .json({
          message: "Tour updated successfully by admin.",
          data: updatedTour,
        });
    } catch (error) {
      console.error("Admin error updating tour:", error);
      if (error.message === "TourNotFound") {
        return res.status(404).json({ error: "Tour not found." });
      }
      res.status(500).json({ error: "Failed to update tour." });
    }
  }
);

// DELETE /api/admin/tours/:id
adminToursRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await knex.transaction(async (trx) => {
      const tour = await trx("travel_plans")
        .where({ id, plan_type: "tour" })
        .first();
      if (!tour) throw new Error("TourNotFound");

      await trx("user_favorites")
        .where({ item_id: id, item_type: "tour" })
        .del();
      await trx("travel_plans").where({ id }).del();
    });

    res
      .status(200)
      .json({ message: "Tour and all related data deleted successfully." });
  } catch (error) {
    console.error("Admin error deleting tour:", error);
    if (error.message === "TourNotFound") {
      return res.status(404).json({ error: "Tour not found." });
    }
    res.status(500).json({ error: "Failed to delete tour." });
  }
});

// --- Nested Routers for Tour Sub-Resources ---
adminToursRouter.use("/:tourId/destinations", adminDestinationsRouter);
adminToursRouter.use("/:tourId/accommodations", adminAccommodationsRouter);
adminToursRouter.use("/:tourId/flights", adminFlightsRouter);

export default adminToursRouter;
