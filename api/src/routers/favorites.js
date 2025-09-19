import express from "express";
import knex from "../db.mjs";
import { favoriteSchema } from "../validation/schemas.js";
import { validateRequest } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const favoritesRouter = express.Router();

// Apply authentication to all routes in this file.
favoritesRouter.use(authenticateToken);

// Helper to check if the item exists in the database.
const itemExists = async (item_id, item_type) => {
  let tableName;
  switch (item_type) {
    case "tour":
      tableName = "travel_plans";
      break;
    case "post":
      tableName = "user_posts";
      break;
    case "attraction":
      tableName = "attraction_posts";
      break;
    default:
      return false;
  }
  const item = await knex(tableName).where({ id: item_id }).first();
  return !!item;
};

// GET /api/favorites - Get all favorites for the logged-in user
favoritesRouter.get("/", async (req, res) => {
  const userId = req.user.id || req.user.sub;
  try {
    const favorites = await knex("user_favorites as uf")
      .select(
        "uf.item_id",
        "uf.item_type",
        "uf.created_at",
        knex.raw(`CASE
              WHEN uf.item_type = 'tour' THEN tp.name
              WHEN uf.item_type = 'post' THEN up.title
              WHEN uf.item_type = 'attraction' THEN ap.title
            END as title`),
        knex.raw(`CASE
              WHEN uf.item_type = 'tour' THEN tp.cover_image_url
              ELSE null
            END as image_url`)
      )
      .leftJoin("travel_plans as tp", function () {
        this.on("tp.id", "=", "uf.item_id").andOn(
          "uf.item_type",
          "=",
          knex.raw("'tour'")
        );
      })
      .leftJoin("user_posts as up", function () {
        this.on("up.id", "=", "uf.item_id").andOn(
          "uf.item_type",
          "=",
          knex.raw("'post'")
        );
      })
      .leftJoin("attraction_posts as ap", function () {
        this.on("ap.id", "=", "uf.item_id").andOn(
          "uf.item_type",
          "=",
          knex.raw("'attraction'")
        );
      })
      .where("uf.user_id", userId)
      .orderBy("uf.created_at", "desc");

    res.json({
      message: "Your favorites have been retrieved successfully.",
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    res.status(500).json({ error: "Failed to retrieve your favorites." });
  }
});

// POST /api/favorites - Add a new favorite
favoritesRouter.post("/", validateRequest(favoriteSchema), async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;
    const { item_id, item_type } = req.validatedData;

    // Verify that the item  exists.
    if (!(await itemExists(item_id, item_type))) {
      return res.status(404).json({
        error: "Not Found",
        message: "The item you are trying to favorite does not exist.",
      });
    }

    const [newFavorite] = await knex("user_favorites")
      .insert({ user_id: userId, item_id, item_type })
      .returning("*");

    res.status(201).json({
      message: `Successfully added ${item_type} to your favorites.`,
      data: newFavorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(409).json({
        error: "Already favorited",
        message: "You have already added this item to your favorites.",
      });
    }
    res.status(500).json({
      error: "Favorite submission failed",
      message:
        "We encountered an error while adding this item to your favorites.",
    });
  }
});

// DELETE /api/favorites/:itemId - Remove a favorite
favoritesRouter.delete("/:itemId", async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;
    const { itemId } = req.params;

    const count = await knex("user_favorites")
      .where({ user_id: userId, item_id: itemId })
      .del();

    if (count === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "This item was not found in your favorites.",
      });
    }

    res
      .status(200)
      .json({ message: "Item successfully removed from your favorites." });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({
      error: "Favorite removal failed",
      message:
        "We encountered an error while removing this item from your favorites.",
    });
  }
});

export default favoritesRouter;
