import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";
import { adminAttractionSchema } from "../../validation/schemas.js";
import adminAttractionPhotosRouter from "./attractionPhotos.js";

const adminAttractionsRouter = express.Router();
adminAttractionsRouter.use(authenticateToken, requireRole(["admin"]));

// --- Main Attraction Routes ---

adminAttractionsRouter.get("/", async (req, res) => {
  try {
    const {
      search = "",
      sort = "created_at-desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = knex("attraction_posts").select("*");
    const countQuery = knex("attraction_posts");

    if (search) {
      const searchTerm = `%${search}%`;
      query
        .where("title", "ilike", searchTerm)
        .orWhere("content", "ilike", searchTerm);
      countQuery
        .where("title", "ilike", searchTerm)
        .orWhere("content", "ilike", searchTerm);
    }

    const [sortField, sortOrder] = sort.split("-");
    if (
      ["title", "location", "created_at"].includes(sortField) &&
      ["asc", "desc"].includes(sortOrder)
    ) {
      query.orderBy(sortField, sortOrder);
    }

    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    const attractions = await query;
    const totalResult = await countQuery.count("* as count").first();
    const total = parseInt(totalResult.count);

    // Fetch photos for each attraction
    const attractionsWithPhotos = await Promise.all(
      attractions.map(async (attraction) => {
        const photos = await knex("attraction_post_photos")
          .where({ post_id: attraction.id })
          .limit(1); // Get only the first photo for the card
        
        // Helper function to properly handle image URLs
        const processImageUrl = (url) => {
          if (!url) return null;
          // If it's already a complete URL (starts with http/https), return as is
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          // Otherwise, prepend the protocol and host for relative URLs
          return `${req.protocol}://${req.get("host")}${url}`;
        };

        const photosWithUrls = photos.map((p) => ({
          ...p,
          image_url: processImageUrl(p.image_url),
        }));

        return {
          ...attraction,
          photos: photosWithUrls,
        };
      })
    );

    res.json({
      message: "Attractions retrieved successfully for admin.",
      data: attractionsWithPhotos,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Admin error fetching attractions:", error);
    res.status(500).json({ error: "Failed to retrieve attractions." });
  }
});

adminAttractionsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const attraction = await knex("attraction_posts").where({ id }).first();
    if (!attraction) {
      return res.status(404).json({ error: "Attraction not found." });
    }

    const photos = await knex("attraction_post_photos").where({ post_id: id });
    
    // Helper function to properly handle image URLs
    const processImageUrl = (url) => {
      if (!url) return null;
      // If it's already a complete URL (starts with http/https), return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Otherwise, prepend the protocol and host for relative URLs
      return `${req.protocol}://${req.get("host")}${url}`;
    };

    const photosWithUrls = photos.map((p) => ({
      ...p,
      image_url: processImageUrl(p.image_url),
    }));

    res.json({
      message: "Attraction details retrieved successfully for admin.",
      data: { ...attraction, photos: photosWithUrls },
    });
  } catch (error) {
    console.error("Admin error fetching single attraction:", error);
    res.status(500).json({ error: "Failed to retrieve attraction." });
  }
});

adminAttractionsRouter.post(
  "/",
  validateRequest(adminAttractionSchema),
  async (req, res) => {
    try {
      const [newAttraction] = await knex("attraction_posts")
        .insert(req.validatedData)
        .returning("*");
      res
        .status(201)
        .json({
          message: "Attraction created successfully by admin.",
          data: newAttraction,
        });
    } catch (error) {
      console.error("Admin error creating attraction:", error);
      res.status(500).json({ error: "Failed to create attraction." });
    }
  }
);

adminAttractionsRouter.put(
  "/:id",
  validateRequest(adminAttractionSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [updatedAttraction] = await knex("attraction_posts")
        .where({ id })
        .update(req.validatedData)
        .returning("*");
      if (!updatedAttraction) {
        return res.status(404).json({ error: "Attraction not found." });
      }
      res
        .status(200)
        .json({
          message: "Attraction updated successfully by admin.",
          data: updatedAttraction,
        });
    } catch (error) {
      console.error("Admin error updating attraction:", error);
      res.status(500).json({ error: "Failed to update attraction." });
    }
  }
);

adminAttractionsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await knex.transaction(async (trx) => {
      const attraction = await trx("attraction_posts").where({ id }).first();
      if (!attraction) throw new Error("AttractionNotFound");

      await trx("user_favorites")
        .where({ item_id: id, item_type: "attraction" })
        .del();
      await trx("attraction_posts").where({ id }).del();
    });
    res
      .status(200)
      .json({
        message: "Attraction and all related data deleted successfully.",
      });
  } catch (error) {
    console.error("Admin error deleting attraction:", error);
    if (error.message === "AttractionNotFound") {
      return res.status(404).json({ error: "Attraction not found." });
    }
    res.status(500).json({ error: "Failed to delete attraction." });
  }
});

// --- Nested Router for Attraction Photos ---
adminAttractionsRouter.use("/:id/photos", adminAttractionPhotosRouter);

export default adminAttractionsRouter;
