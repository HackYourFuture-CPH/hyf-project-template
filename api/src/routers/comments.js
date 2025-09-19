import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { commentSchema } from "../validation/schemas.js";

const commentsRouter = express.Router({ mergeParams: true });

// Middleware to determine the parent type ('post' or 'attraction')
const determineCommentableType = (req, res, next) => {
  // CORRECTED LOGIC: Use req.baseUrl instead of req.originalUrl
  if (req.baseUrl.includes("/blogposts")) {
    req.commentableType = "post";
  } else if (req.baseUrl.includes("/attractions")) {
    req.commentableType = "attraction";
  } else {
    return res.status(400).json({ error: "Invalid comment route." });
  }
  next();
};

// GET all approved comments for a resource (blogpost or attraction)
commentsRouter.get("/", determineCommentableType, async (req, res) => {
  try {
    const { id: commentableId } = req.params;
    const comments = await knex("comments as c")
      .join("users as u", "c.user_id", "u.id")
      .select("c.*", "u.username", "u.first_name", "u.last_name")
      .where({
        commentable_id: commentableId,
        commentable_type: req.commentableType,
        status: "approved",
      })
      .orderBy("c.created_at", "asc");
    res.json({ message: "Comments retrieved successfully.", data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments." });
  }
});

// POST a new comment (protected)
commentsRouter.post(
  "/",
  authenticateToken,
  determineCommentableType,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { id: commentableId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const [newComment] = await knex("comments")
        .insert({
          user_id: userId,
          content,
          commentable_id: commentableId,
          commentable_type: req.commentableType,
        })
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

// PUT to update a comment (protected, user must own comment)
commentsRouter.put(
  "/:commentId",
  authenticateToken,
  validateRequest(commentSchema),
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.id || req.user.sub;
      const { content } = req.validatedData;

      const [updatedComment] = await knex("comments")
        .where({ id: commentId, user_id: userId }) // User can only edit their own
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

// DELETE a comment (protected, user must own comment)
commentsRouter.delete("/:commentId", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id || req.user.sub;

    const deletedCount = await knex("comments")
      .where({ id: commentId, user_id: userId }) // User can only delete their own
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
