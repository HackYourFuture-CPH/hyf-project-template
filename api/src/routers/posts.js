import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { postSchema } from "../validation/schemas.js";
import commentsRouter from "./comments.js";

const router = express.Router();

// Note: Keep GET routes public. Apply `authenticateToken` only to mutating routes.

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await knex("posts").select("*").orderBy("created_at", "desc");

    res.json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      error: "Posts retrieval failed",
      message: "We encountered an error while loading the posts. Please try again later.",
    });
  }
});

// GET single post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await knex("posts").where({ id }).first();

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
        message: "We couldn't find the post you're looking for.",
      });
    }

    res.json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      error: "Post retrieval failed",
      message: "We encountered an error while loading the post. Please try again later.",
    });
  }
});

// POST create new post
router.post("/", authenticateToken, validateRequest(postSchema), async (req, res) => {
  try {
    const { title, content } = req.validatedData;
    const userId = req.user && (req.user.id || req.user.sub);

    const [newPost] = await knex("posts")
      .insert({
        title,
        content,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    res.status(201).json({
      message: "Great! Your post has been created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      error: "Post creation failed",
      message: "We encountered an error while creating your post. Please try again later.",
    });
  }
});

// PUT update post
router.put("/:id", authenticateToken, validateRequest(postSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.validatedData;
    const userId = req.user && (req.user.id || req.user.sub);

    // Check if post exists and belongs to user
    const existingPost = await knex("posts").where({ id, user_id: userId }).first();

    if (!existingPost) {
      return res.status(404).json({
        error: "Post not found or access denied",
        message:
          "We couldn't find the post you're trying to update, or you don't have permission to edit it.",
      });
    }

    const [updatedPost] = await knex("posts")
      .where({ id })
      .update({
        title,
        content,
        updated_at: new Date(),
      })
      .returning("*");

    res.json({
      message: "Excellent! Your post has been updated successfully.",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      error: "Post update failed",
      message: "We encountered an error while updating your post. Please try again later.",
    });
  }
});

// DELETE post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && (req.user.id || req.user.sub);

    // Check if post exists and belongs to user
    const existingPost = await knex("posts").where({ id, user_id: userId }).first();

    if (!existingPost) {
      return res.status(404).json({
        error: "Post not found or access denied",
        message:
          "We couldn't find the post you're trying to delete, or you don't have permission to remove it.",
      });
    }

    await knex("posts").where({ id }).del();

    res.json({
      message: "Your post has been deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      error: "Post deletion failed",
      message: "We encountered an error while deleting your post. Please try again later.",
    });
  }
});

// post comments
router.use("/:id/comments", commentsRouter);

export default router;
