import express from "express";
import pool from "../database.js";

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
