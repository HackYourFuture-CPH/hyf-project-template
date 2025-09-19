import express from "express";
import knex from "../../db.mjs";
import { authenticateToken } from "../../middleware/auth.js";

const commentsRouter = express.Router();

// Apply authentication to all routes
commentsRouter.use(authenticateToken);

// Get all comments for admin management with pagination
commentsRouter.get("/", async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    const comments = await knex("comments as c")
      .join("users as u", "c.user_id", "u.id")
      .leftJoin("user_posts as up", function() {
        this.on("c.commentable_id", "=", "up.id")
             .andOn("c.commentable_type", "=", knex.raw("'post'"));
      })
      .leftJoin("attraction_posts as ap", function() {
        this.on("c.commentable_id", "=", "ap.id")
             .andOn("c.commentable_type", "=", knex.raw("'attraction'"));
      })
      .select(
        "c.*",
        "u.first_name",
        "u.last_name",
        "u.username",
        knex.raw("COALESCE(up.title, ap.title) as post_title"),
        "c.commentable_type"
      )
      .orderBy("c.created_at", "desc")
      .limit(limitNum)
      .offset(offsetNum);

    // Get total count for pagination
    const totalCount = await knex("comments").count("* as count").first();

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
      },
      is_approved: comment.status === 'approved'
    }));

    res.json({ 
      message: "Comments retrieved successfully.", 
      data: transformedComments,
      pagination: {
        total: parseInt(totalCount.count),
        limit: limitNum,
        offset: offsetNum,
        hasMore: (offsetNum + limitNum) < parseInt(totalCount.count)
      }
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
    const comment = await knex("comments")
      .where({ id: commentId })
      .first();

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Toggle approval status
    const newStatus = comment.status === 'approved' ? 'pending' : 'approved';
    
    const [updatedComment] = await knex("comments")
      .where({ id: commentId })
      .update({ status: newStatus })
      .returning("*");

    res.json({
      message: `Comment ${newStatus === 'approved' ? 'approved' : 'unapproved'} successfully.`,
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

    const deletedCount = await knex("comments")
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

