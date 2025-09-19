import express from "express";
import knex from "../../db.mjs";
import { z } from "zod";
import { validateRequest } from "../../middleware/validation.js";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

// A validation schema to ensure we receive a valid URL from the frontend
const photoSchema = z.object({
  image_url: z.string().url("A valid image URL is required."),
  caption: z
    .string()
    .max(255, "Caption must be 255 characters or less.")
    .optional(),
});

const router = express.Router({ mergeParams: true });

// All routes in this file are for admins only
router.use(authenticateToken, requireRole(["admin"]));

// POST /api/admin/attractions/:id/photos - Add a photo to an attraction
router.post("/", validateRequest(photoSchema), async (req, res) => {
  const { id: postId } = req.params;
  const { image_url, caption } = req.validatedData;

  try {
    const [newPhoto] = await knex("attraction_post_photos")
      .insert({
        post_id: postId,
        image_url: image_url,
        caption: caption || null,
      })
      .returning("*");
    res.status(201).json({
      message: "Photo added to attraction successfully.",
      data: newPhoto,
    });
  } catch (error) {
    console.error("Error adding attraction photo:", error);
    res.status(500).json({ error: "Failed to add photo to attraction." });
  }
});

// DELETE /api/admin/attractions/:id/photos/:photoId - Delete a photo
router.delete("/:photoId", async (req, res) => {
  const { photoId } = req.params;
  try {
    const deleteCount = await knex("attraction_post_photos")
      .where({ id: photoId })
      .del();
    if (deleteCount === 0) {
      return res.status(404).json({ error: "Photo not found." });
    }
    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting attraction photo:", error);
    res.status(500).json({ error: "Failed to delete photo." });
  }
});

export default router;
