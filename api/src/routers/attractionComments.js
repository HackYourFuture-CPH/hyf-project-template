import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { commentSchema } from "../validation/schemas.js";

const router = express.Router({ mergeParams: true });

// GET all comments for a specific attraction
router.get("/", async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await knex("attraction_post_comments as ac")
      .join("users as u", "ac.user_id", "u.id")
      .select(
        "ac.*",
        "u.username",
        "u.first_name",
        "u.last_name",
        "u.profile_image"
      )
      .where({ post_id: postId })
      .orderBy("ac.created_at", "asc");

    res.json({
      message: "Comments retrieved successfully.",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching attraction comments:", error);
    res.status(500).json({
      error: "Comment retrieval failed",
      message:
        "We encountered an error while loading comments for this attraction.",
    });
  }
});

// POST a new comment on an attraction
router.post(
  "/",
  authenticateToken,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { id: postId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const attraction = await knex("attraction_posts")
        .where({ id: postId })
        .first();
      if (!attraction) {
        return res.status(404).json({ error: "Attraction not found." });
      }

      const [newComment] = await knex("attraction_post_comments")
        .insert({ user_id: userId, post_id: postId, content })
        .returning("*");

      const commentWithUser = await knex("attraction_post_comments as ac")
        .join("users as u", "ac.user_id", "u.id")
        .select(
          "ac.*",
          "u.username",
          "u.first_name",
          "u.last_name",
          "u.profile_image"
        )
        .where({ "ac.id": newComment.id })
        .first();

      res.status(201).json({
        message: "Your comment has been posted successfully.",
        data: commentWithUser,
      });
    } catch (error) {
      console.error("Error posting attraction comment:", error);
      res.status(500).json({
        error: "Comment submission failed",
        message: "We encountered an error while posting your comment.",
      });
    }
  }
);

// UPDATE an existing comment
router.put(
  "/:commentId",
  authenticateToken,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const [updatedComment] = await knex("attraction_post_comments")
        .where({ id: commentId, user_id: userId })
        .update({ content })
        .returning("*");

      if (!updatedComment) {
        return res.status(404).json({
          error: "Update failed",
          message:
            "Comment not found, or you do not have permission to update it.",
        });
      }

      res.json({
        message: "Your comment has been updated successfully.",
        data: updatedComment,
      });
    } catch (error) {
      console.error("Error updating attraction comment:", error);
      res.status(500).json({
        error: "Comment update failed",
        message: "We encountered an error while updating your comment.",
      });
    }
  }
);

// DELETE a comment
router.delete("/:commentId", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id || req.user.sub;

    const deleteCount = await knex("attraction_post_comments")
      .where({ id: commentId, user_id: userId })
      .del();

    if (deleteCount === 0) {
      return res.status(404).json({
        error: "Deletion failed",
        message:
          "Comment not found, or you do not have permission to delete it.",
      });
    }

    res
      .status(200)
      .json({ message: "Your comment has been deleted successfully." });
  } catch (error) {
    console.error("Error deleting attraction comment:", error);
    res.status(500).json({
      error: "Comment deletion failed",
      message: "We encountered an error while deleting your comment.",
    });
  }
});

export default router;
