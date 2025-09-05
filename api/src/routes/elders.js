import express from "express";
import pool from "../database.js";

const router = express.Router();

// Get all elders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM elders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get single elder
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM elders WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create elder
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone_nr,
      address,
      post_nr,
      service_id,
      photo,
      gender,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO elders (name,email,phone_nr,address,post_nr,service_id,photo,gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, email, phone_nr, address, post_nr, service_id, photo, gender]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update elder
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone_nr,
      address,
      post_nr,
      service_id,
      photo,
      gender,
    } = req.body;
    const result = await pool.query(
      `UPDATE elders SET name=$1,email=$2,phone_nr=$3,address=$4,post_nr=$5,service_id=$6,photo=$7,gender=$8
       WHERE id=$9 RETURNING *`,
      [name, email, phone_nr, address, post_nr, service_id, photo, gender, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete elder
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM elders WHERE id=$1", [id]);
    res.json({ message: "Elder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
