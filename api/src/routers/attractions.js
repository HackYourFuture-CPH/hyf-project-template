import express from "express";
import knex from "../db.mjs";
import { optionalAuth } from "../middleware/auth.js";
import commentsRouter from "./comments.js";

const router = express.Router();

// GET all attractions with filtering, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      category = "",
      sort = "title-asc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = knex("attraction_posts as ap").select(
      "ap.*",
      knex.raw(
        `(SELECT app.image_url FROM attraction_post_photos as app WHERE app.post_id = ap.id ORDER BY app.uploaded_at ASC LIMIT 1) as cover_image_url`
      )
    );
    const countQuery = knex("attraction_posts as ap");

    // Apply search filter to title, content, and location
    if (search) {
      const searchTerm = `%${search}%`;
      const searchFilter = (builder) =>
        builder
          .where("ap.title", "ilike", searchTerm)
          .orWhere("ap.content", "ilike", searchTerm)
          .orWhere("ap.location", "ilike", searchTerm);
      query.where(searchFilter);
      countQuery.where(searchFilter);
    }

    // Apply specific location filter
    if (location) {
      query.where("ap.location", "ilike", `%${location}%`);
      countQuery.where("ap.location", "ilike", `%${location}%`);
    }

    // Apply category filter
    if (category) {
      query.where("ap.category", "ilike", `%${category}%`);
      countQuery.where("ap.category", "ilike", `%${category}%`);
    }

    const totalResult = await countQuery.count("* as count").first();
    const total = parseInt(totalResult.count);

    // Apply sorting
    const [sortField, sortOrder] = sort.split("-");
    if (
      ["title", "location", "created_at", "category"].includes(sortField) &&
      ["asc", "desc"].includes(sortOrder)
    ) {
      query.orderBy(`ap.${sortField}`, sortOrder);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    const attractions = await query;

    res.json({
      message: "Attractions retrieved successfully",
      data: attractions,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res.status(500).json({
      error: "Attraction retrieval failed",
      message:
        "We encountered an error while loading the attractions. Please try again later.",
    });
  }
});

// GET unique locations for filtering
router.get("/locations", async (req, res) => {
  try {
    const locations = await knex("attraction_posts")
      .distinct("location")
      .orderBy("location");
    res.json({
      message: "Locations retrieved successfully",
      data: locations.map((loc) => loc.location).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      error: "Locations retrieval failed",
      message:
        "We encountered an error while loading locations. Please try again later.",
    });
  }
});

// GET unique categories for filtering
router.get("/categories", async (req, res) => {
  try {
    const categories = await knex("attraction_posts")
      .distinct("category")
      .orderBy("category");
    res.json({
      message: "Categories retrieved successfully",
      data: categories.map((cat) => cat.category).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      error: "Categories retrieval failed",
      message:
        "We encountered an error while loading categories. Please try again later.",
    });
  }
});

// GET single attraction by ID with photos and comments
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const attraction = await knex("attraction_posts").where({ id }).first();

    if (!attraction) {
      return res.status(404).json({
        error: "Attraction not found",
        message: "We couldn't find the attraction you're looking for.",
      });
    }

    const [photos, comments] = await Promise.all([
      knex("attraction_post_photos").where("post_id", id),
      // Use the generic `comments` table for attraction comments
      knex("comments as c")
        .select("c.*", "u.username", "u.first_name", "u.last_name")
        .join("users as u", "c.user_id", "u.id")
        .where({ commentable_id: id, commentable_type: "attraction", status: "approved" })
        .orderBy("c.created_at", "asc"),
    ]);

    res.json({
      message: "Attraction retrieved successfully",
      data: { ...attraction, photos, comments },
    });
  } catch (error) {
    console.error("Error fetching attraction:", error);
    res.status(500).json({
      error: "Attraction retrieval failed",
      message:
        "We encountered an error while loading the attraction. Please try again later.",
    });
  }
});

// Nested router for comments
router.use("/:id/comments", commentsRouter);

export default router;
