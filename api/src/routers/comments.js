import express from "express";
import knex from "../db.mjs";
import { commentSchema } from "../validation/schemas.js";
import { validateRequest } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const commentsRouter = express.Router({ mergeParams: true });

// Apply authentication to all routes
//commentsRouter.use(authenticateToken);

// get all comments for a specific post
commentsRouter.get("/", async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await knex("user_post_comments")
      .where({ post_id: postId })
      .orderBy("created_at", "asc");

    res.json({
      message: "Comments retrieved successfully.",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      error: "Comment retrieval failed",
      message: "We encountered an error while loading comments for this post.",
    });
  }
});

// post a new comment
commentsRouter.post("/", validateRequest(commentSchema), async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id || req.user.sub;
    const { content } = req.validatedData;

    const [newComment] = await knex("user_post_comments")
      .insert({ user_id: userId, post_id: postId, content })
      .returning("*");

    res.status(201).json({
      message: "Your comment has been posted successfully.",
      data: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({
      error: "Comment submission failed",
      message: "We encountered an error while posting your comment.",
    });
  }
});

// update an existing comment
commentsRouter.put(
  "/:commentId",
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      // Make sure a user can only update their own comment.
      const [updatedComment] = await knex("user_post_comments")
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
      console.error("Error updating comment:", error);
      res.status(500).json({
        error: "Comment update failed",
        message: "We encountered an error while updating your comment.",
      });
    }
  }
);

// DELETE a comment
commentsRouter.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id || req.user.sub;

    // Find the comment to ensure it exists and is owned by the user.
    const commentToDelete = await knex("user_post_comments")
      .where({ id: commentId, user_id: userId })
      .first();

    if (!commentToDelete) {
      return res.status(404).json({
        error: "Deletion failed",
        message:
          "Comment not found, or you do not have permission to delete it.",
      });
    }

    await knex("user_post_comments").where({ id: commentId }).del();

    res
      .status(200)
      .json({ message: "Your comment has been deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      error: "Comment deletion failed",
      message: "We encountered an error while deleting your comment.",
    });
  }
});

export default commentsRouter;
