import express from "express";
import knex from "../../db.mjs";
import { authenticateToken } from "../../middleware/auth.js";

const commentsRouter = express.Router();

// Apply authentication to all routes
commentsRouter.use(authenticateToken);

// Get all comments for admin management
commentsRouter.get("/", async (req, res) => {
  try {
    const comments = await knex("user_post_comments as upc")
      .join("users as u", "upc.user_id", "u.id")
      .join("user_posts as up", "upc.post_id", "up.id")
      .select(
        "upc.*",
        "u.first_name",
        "u.last_name",
        "u.username",
        "up.title as post_title"
      )
      .orderBy("upc.created_at", "desc");

    // Transform the data to match the expected format
    const transformedComments = comments.map(comment => ({
      ...comment,
      user: {
        first_name: comment.first_name,
        last_name: comment.last_name,
        username: comment.username
      },
      post: {
        title: comment.post_title
      }
    }));

    res.json({ 
      message: "Comments retrieved successfully.", 
      data: transformedComments 
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({ 
      error: "Failed to retrieve comments.",
      message: "We encountered an error while loading comments."
    });
  }
});

// Toggle comment approval status
commentsRouter.put("/:commentId/toggle-approval", async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Get current approval status
    const comment = await knex("user_post_comments")
      .where({ id: commentId })
      .first();

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Toggle approval status
    const newApprovalStatus = !comment.is_approved;
    
    const [updatedComment] = await knex("user_post_comments")
      .where({ id: commentId })
      .update({ is_approved: newApprovalStatus })
      .returning("*");

    res.json({
      message: `Comment ${newApprovalStatus ? 'approved' : 'unapproved'} successfully.`,
      data: updatedComment
    });
  } catch (error) {
    console.error("Error toggling comment approval:", error);
    res.status(500).json({ error: "Failed to update comment approval status." });
  }
});

// Delete a comment (admin)
commentsRouter.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    const deletedCount = await knex("user_post_comments")
      .where({ id: commentId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

export default commentsRouter;

