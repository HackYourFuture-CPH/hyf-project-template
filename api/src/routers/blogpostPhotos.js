import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { z } from "zod";
import { validateRequest } from "../middleware/validation.js";

// A simple validation schema for the new endpoint
const photoSchema = z.object({
  image_url: z.string().url("A valid image URL is required."),
  caption: z.string().optional(),
});

const router = express.Router({ mergeParams: true });

// All routes require a user to be logged in
router.use(authenticateToken);

// POST /api/blogposts/:id/photos - Add a new photo URL from UploadThing
router.post("/", validateRequest(photoSchema), async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id || req.user.sub;
  const { image_url, caption } = req.validatedData;

  try {
    // First, verify the user owns the blogpost
    const post = await knex("user_posts")
      .where({ id: postId, user_id: userId })
      .first();

    if (!post) {
      return res
        .status(404)
        .json({ error: "Blogpost not found or you do not have permission." });
    }

    // Insert the new photo record into the database with the URL from UploadThing
    const [newPhoto] = await knex("user_post_photos")
      .insert({
        post_id: postId,
        image_url: image_url, // The URL comes directly from the request body
        caption: caption || null,
      })
      .returning("*");

    res.status(201).json({
      message: "Photo added successfully.",
      data: newPhoto,
    });
  } catch (error) {
    console.error("Error adding photo URL:", error);
    res.status(500).json({ error: "Failed to add photo." });
  }
});

// DELETE /api/blogposts/:id/photos/:photoId - Delete a photo
router.delete("/:photoId", async (req, res) => {
  const { id: postId, photoId } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    // To ensure security, we'll run a single query that joins the tables
    // to verify that the user owns the post that the photo belongs to.
    const postOwner = await knex("user_post_photos")
      .join("user_posts", "user_post_photos.post_id", "user_posts.id")
      .where("user_post_photos.id", photoId)
      .andWhere("user_posts.user_id", userId)
      .select("user_posts.user_id")
      .first();

    if (!postOwner) {
      return res.status(404).json({
        error: "Photo not found or you do not have permission to delete it.",
      });
    }

    // If the owner is verified, proceed with deletion
    await knex("user_post_photos").where({ id: photoId }).del();

    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ error: "Failed to delete photo." });
  }
});

export default router;
