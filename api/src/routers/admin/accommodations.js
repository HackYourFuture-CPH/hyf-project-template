import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const adminAccommodationsRouter = express.Router({ mergeParams: true });
adminAccommodationsRouter.use(authenticateToken, requireRole(["admin"]));

// POST /api/admin/tours/:tourId/accommodations - Add an accommodation to a tour
adminAccommodationsRouter.post("/", async (req, res) => {
  try {
    const { tourId } = req.params;
    const { destination_id, name, type, rating, price_minor, currency_code } =
      req.body;

    if (!destination_id || !name || !type) {
      return res
        .status(400)
        .json({ error: "Missing required fields for accommodation." });
    }

    const [newAccommodation] = await knex("tour_accommodations")
      .insert({
        tour_id: tourId,
        destination_id,
        name,
        type,
        rating,
        price_minor,
        currency_code,
      })
      .returning("*");

    res.status(201).json({
      message: "Accommodation added successfully.",
      data: newAccommodation,
    });
  } catch (error) {
    console.error("Admin error adding accommodation:", error);
    res.status(500).json({ error: "Failed to add accommodation." });
  }
});

// PUT /api/admin/tours/:tourId/accommodations/:accommodationId - Update an accommodation
adminAccommodationsRouter.put("/:accommodationId", async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const [updatedAccommodation] = await knex("tour_accommodations")
      .where({ id: accommodationId })
      .update(req.body, ["id", "name", "type", "rating"]);

    if (!updatedAccommodation) {
      return res.status(404).json({ error: "Accommodation not found." });
    }
    res.status(200).json({
      message: "Accommodation updated successfully.",
      data: updatedAccommodation,
    });
  } catch (error) {
    console.error("Admin error updating accommodation:", error);
    res.status(500).json({ error: "Failed to update accommodation." });
  }
});

// DELETE /api/admin/tours/:tourId/accommodations/:accommodationId - Remove an accommodation
adminAccommodationsRouter.delete("/:accommodationId", async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const count = await knex("tour_accommodations")
      .where({ id: accommodationId })
      .del();

    if (count === 0) {
      return res.status(404).json({ error: "Accommodation not found." });
    }
    res.status(200).json({ message: "Accommodation removed successfully." });
  } catch (error) {
    console.error("Admin error deleting accommodation:", error);
    res.status(500).json({ error: "Failed to delete accommodation." });
  }
});

export default adminAccommodationsRouter;
