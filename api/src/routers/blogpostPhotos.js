import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const photosRouter = express.Router({ mergeParams: true });

// Add a photo to a post (protected)
photosRouter.post("/", authenticateToken, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id || req.user.sub;
    const { image_url, caption } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: "image_url is required." });
    }

    // Verify user owns the post
    const post = await knex("user_posts")
      .where({ id: postId, user_id: userId })
      .first();
    if (!post) {
      return res
        .status(403)
        .json({ error: "Permission denied to add photo to this post." });
    }

    const [newPhoto] = await knex("user_post_photos")
      .insert({ post_id: postId, image_url, caption })
      .returning("*");

    res
      .status(201)
      .json({ message: "Photo added successfully.", data: newPhoto });
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(500).json({ error: "Failed to add photo." });
  }
});

// Delete a photo from a post (protected)
photosRouter.delete("/:photoId", authenticateToken, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id || req.user.sub;

    // Verify user owns the post that the photo belongs to
    const photo = await knex("user_post_photos")
      .join("user_posts", "user_post_photos.post_id", "=", "user_posts.id")
      .where({
        "user_post_photos.id": photoId,
        "user_posts.user_id": userId,
      })
      .select("user_post_photos.id")
      .first();

    if (!photo) {
      return res.status(404).json({
        error: "Photo not found or you do not have permission to delete it.",
      });
    }

    await knex("user_post_photos").where({ id: photoId }).del();
    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ error: "Failed to delete photo." });
  }
});

export default photosRouter;
