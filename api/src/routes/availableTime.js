import express from "express";
import pool from "../database.js";

const router = express.Router();

// Get all available times
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM available_time");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add available time
router.post("/", async (req, res) => {
  try {
    const { user_id, volunteer_id, service_id, date } = req.body;
    const result = await pool.query(
      "INSERT INTO available_time (user_id, volunteer_id, service_id, date) VALUES ($1,$2,$3,$4) RETURNING *",
      [user_id, volunteer_id, service_id, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
