import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);

//  GET all shortlisted items for a trip, now with vote counts
router.get("/", async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    const shortlist = await knex("trip_shortlist_items as tsi")
      .join("attraction_posts as ap", "tsi.attraction_id", "ap.id")
      .leftJoin("trip_votes as tv", "tsi.id", "tv.shortlist_item_id")
      .leftJoin(
        knex("attraction_post_photos as app")
          .select("post_id")
          .min("image_url as image_url")
          .groupBy("post_id")
          .as("app"),
        "app.post_id",
        "ap.id"
      )
      .select(
        "tsi.id as shortlistItemId",
        "ap.id",
        "ap.title as name",
        "app.image_url as image"
      )
      .where("tsi.trip_id", tripId)
      .groupBy("tsi.id", "ap.id", "app.image_url")
      .count("tv.id as voteCount")
      .select(
        knex.raw(
          `CASE WHEN EXISTS (SELECT 1 FROM trip_votes WHERE shortlist_item_id = tsi.id AND user_id = ?) THEN TRUE ELSE FALSE END as userHasVoted`,
          [userId]
        )
      );

    res.status(200).json({ data: shortlist });
  } catch (error) {
    console.error("Error fetching shortlist:", error);
    res.status(500).json({ error: "Failed to fetch shortlist." });
  }
});

// POST a new item to the shortlist
router.post("/", async (req, res) => {
  const { tripId } = req.params;
  const { attraction_id } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!attraction_id) {
    return res.status(400).json({ error: "Attraction ID is required." });
  }

  try {
    const existing = await knex("trip_shortlist_items")
      .where({ trip_id: tripId, attraction_id: attraction_id })
      .first();

    if (existing) {
      return res.status(200).json({ message: "Item is already shortlisted." });
    }

    const [newItem] = await knex("trip_shortlist_items")
      .insert({
        trip_id: tripId,
        attraction_id: attraction_id,
        added_by_user_id: userId,
      })
      .returning("*");

    const attractionDetails = await knex("attraction_posts")
      .select("id", "title as name")
      .where({ id: newItem.attraction_id })
      .first();

    res.status(201).json({
      message: "Attraction added to shortlist.",
      data: attractionDetails,
    });
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    res.status(500).json({ error: "Failed to add item to shortlist." });
  }
});

// NEW: POST to cast or retract a vote for a shortlist item
router.post("/:shortlistItemId/vote", async (req, res) => {
  const { shortlistItemId } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    const existingVote = await knex("trip_votes")
      .where({
        shortlist_item_id: shortlistItemId,
        user_id: userId,
      })
      .first();

    if (existingVote) {
      await knex("trip_votes").where({ id: existingVote.id }).del();
    } else {
      await knex("trip_votes").insert({
        shortlist_item_id: shortlistItemId,
        user_id: userId,
      });
    }

    // Get the new total vote count for the item
    const voteTotal = await knex("trip_votes")
      .where({ shortlist_item_id: shortlistItemId })
      .count("* as count")
      .first();

    res.status(200).json({
      message: "Vote updated successfully.",
      voteCount: parseInt(voteTotal.count),
      userHasVoted: !existingVote, // If a vote existed, it's now false, and vice-versa
    });
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Failed to update vote." });
  }
});

export default router;
