import express from "express";
import pool from "../database.js";

const router = express.Router();

// Get all volunteer-services relations
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteer_services");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a volunteer-service relation
router.post("/", async (req, res) => {
  try {
    const { volunteer_id, service_id } = req.body;
    const result = await pool.query(
      "INSERT INTO volunteer_services (volunteer_id, service_id) VALUES ($1, $2) RETURNING *",
      [volunteer_id, service_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete relation
router.delete("/", async (req, res) => {
  try {
    const { volunteer_id, service_id } = req.body;
    await pool.query(
      "DELETE FROM volunteer_services WHERE volunteer_id=$1 AND service_id=$2",
      [volunteer_id, service_id]
    );
    res.json({ message: "Relation deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
