import express from "express";
import pool from "../database.js";

const router = express.Router();

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add review
router.post("/", async (req, res) => {
  try {
    const { title, volunteer_id, description, stars, user_id } = req.body;
    const result = await pool.query(
      `INSERT INTO reviews (title, volunteer_id, description, stars, user_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, volunteer_id, description, stars, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
