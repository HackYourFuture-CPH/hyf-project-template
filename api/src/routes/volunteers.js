import express from "express";
import pool from "../database.js";

const router = express.Router();

// 1️.Get all volunteers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 2.Get single volunteer by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM volunteers WHERE id=$1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 3.Create a new volunteer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone_nr, address, post_nr, routine, photo, gender } =
      req.body;
    const result = await pool.query(
      `INSERT INTO volunteers (name,email,phone_nr,address,post_nr,routine,photo,gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, email, phone_nr, address, post_nr, routine, photo, gender]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 4.Update volunteer
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_nr, address, post_nr, routine, photo, gender } =
      req.body;
    const result = await pool.query(
      `UPDATE volunteers SET name=$1,email=$2,phone_nr=$3,address=$4,post_nr=$5,routine=$6,photo=$7,gender=$8
       WHERE id=$9 RETURNING *`,
      [name, email, phone_nr, address, post_nr, routine, photo, gender, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 5.Delete volunteer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM volunteers WHERE id=$1", [id]);
    res.json({ message: "Volunteer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
