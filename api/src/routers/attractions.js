import express from "express";
import knex from "../db.mjs";

const router = express.Router();

// GET all attractions
router.get("/", async (req, res) => {
  try {
    const { search = "" } = req.query; 

    // Build the base query
    let query = knex("attraction_posts as ap").select("*");

    // Apply search filter
    if (search) {
      query
        .where("ap.title", "ilike", `%${search}%`)
        .orWhere("ap.content", "ilike", `%${search}%`)
        .orWhere("ap.location", "ilike", `%${search}%`);
    }

   // const sql ="selct * from attraction_posts as ap where ap.title ilike ? or ap.content ilike ? or ap.location ilike ?"

    const attractions = await query;

    res.json({
      message: "Atrraction retrieved successfully",
      data: attractions,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      error: "Atrraction retrieval failed",
      message:
        "We encountered an error while loading the attractions. Please try again later.",
    });
  }
});

// GET single attraction by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const attraction = await knex("attraction_posts").where({ id }).first();

    if (!attraction) {
      return res.status(404).json({
        error: "Attraction not found",
        message: "We couldn't find the attraction you're looking for.",
      });
    }

    res.json({
      message: "Attraction retrieved successfully",
      data: attraction,
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

export default router;
