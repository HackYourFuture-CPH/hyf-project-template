import express from "express";
import pool from "../database.js"; // pool is imported from database.js to interact with the database

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
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Build SET clause dynamically
    const setClause = Object.keys(fields)
      .map((key, idx) => `${key} = $${idx + 1}`)
      .join(", ");

    const values = Object.values(fields);

    const query = `UPDATE elders SET ${setClause} WHERE id = $${
      values.length + 1
    } RETURNING *`;

    const result = await pool.query(query, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Elder not found" });
    }

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
