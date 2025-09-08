import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { commentSchema } from "../validation/schemas.js";

const commentsRouter = express.Router({ mergeParams: true });

// Get all comments for a specific post (public)
commentsRouter.get("/", async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await knex("user_post_comments")
      .join("users", "user_post_comments.user_id", "users.id")
      .select("user_post_comments.*", "users.first_name", "users.last_name")
      .where({ post_id: postId })
      .orderBy("user_post_comments.created_at", "asc");

    res.json({ message: "Comments retrieved successfully.", data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments." });
  }
});

// Post a new comment (protected)
commentsRouter.post(
  "/",
  authenticateToken,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { id: postId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const [newComment] = await knex("user_post_comments")
        .insert({ user_id: userId, post_id: postId, content })
        .returning("*");

      res
        .status(201)
        .json({ message: "Comment posted successfully.", data: newComment });
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ error: "Failed to post comment." });
    }
  }
);

// Update a comment (protected, user must own comment)
commentsRouter.put(
  "/:commentId",
  authenticateToken,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const [updatedComment] = await knex("user_post_comments")
        .where({ id: commentId, user_id: userId })
        .update({ content })
        .returning("*");

      if (!updatedComment) {
        return res
          .status(404)
          .json({ error: "Comment not found or permission denied." });
      }

      res.json({
        message: "Comment updated successfully.",
        data: updatedComment,
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: "Failed to update comment." });
    }
  }
);

// Delete a comment (protected, user must own comment)
commentsRouter.delete("/:commentId", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id || req.user.sub;

    const deletedCount = await knex("user_post_comments")
      .where({ id: commentId, user_id: userId })
      .del();

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Comment not found or permission denied." });
    }

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

export default commentsRouter;
