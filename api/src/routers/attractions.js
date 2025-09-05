import express from "express";
import knex from "../db.mjs";

const router = express.Router();

// GET all attractions
router.get("/", async (req, res) => {
  try {
     const attractions = await knex("attraction_posts").select("*");

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

export default router;