import express from "express";
import knex from "../db.mjs";
import { favoriteSchema } from "../validation/schemas.js";
import { validateRequest } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const favoritesRouter = express.Router();

// Apply authentication to all routes in this file.
favoritesRouter.use(authenticateToken);

// Helper to check if the item being favorited actually exists in the database.
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
  return !!item; // Returns true if item is found, false otherwise.
};

// POST /api/favorites - Add a new favorite
favoritesRouter.post("/", validateRequest(favoriteSchema), async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;
    const { item_id, item_type } = req.validatedData;

    // Verify that the item the user is trying to favorite actually exists.
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

    // The .where clause ensures a user can only delete their own favorites.
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
