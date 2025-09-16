import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";
import { adminPostSchema } from "../../validation/schemas.js";
import adminPostPhotosRouter from "./postPhotos.js";

const adminPostsRouter = express.Router();
adminPostsRouter.use(authenticateToken, requireRole(["admin"]));

// --- Main Post Routes ---

adminPostsRouter.get("/", async (req, res) => {
  try {
    const {
      search = "",
      sort = "created_at-desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = knex("user_posts").select("*");
    const countQuery = knex("user_posts");

    if (search) {
      const searchTerm = `%${search}%`;
      query
        .where("title", "ilike", searchTerm)
        .orWhere("content", "ilike", searchTerm);
      countQuery
        .where("title", "ilike", searchTerm)
        .orWhere("content", "ilike", searchTerm);
    }

    const [sortField, sortOrder] = sort.split("-");
    if (
      ["title", "category", "created_at"].includes(sortField) &&
      ["asc", "desc"].includes(sortOrder)
    ) {
      query.orderBy(sortField, sortOrder);
    }

    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    const posts = await query;
    const totalResult = await countQuery.count("* as count").first();
    const total = parseInt(totalResult.count);

    // Fetch photos for each post
    const postsWithPhotos = await Promise.all(
      posts.map(async (post) => {
        const photos = await knex("user_post_photos")
          .where({ post_id: post.id })
          .limit(1); // Get only the first photo for the card
        
        // Helper function to properly handle image URLs
        const processImageUrl = (url) => {
          if (!url) return null;
          // If it's already a complete URL (starts with http/https), return as is
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          // Otherwise, prepend the protocol and host for relative URLs
          return `${req.protocol}://${req.get("host")}${url}`;
        };

        const photosWithUrls = photos.map((p) => ({
          ...p,
          image_url: processImageUrl(p.image_url),
        }));

        return {
          ...post,
          photos: photosWithUrls,
        };
      })
    );

    res.json({
      message: "Posts retrieved successfully for admin.",
      data: postsWithPhotos,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Admin error fetching posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts." });
  }
});

adminPostsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await knex("user_posts").where({ id }).first();
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const [photos, comments] = await Promise.all([
      knex("user_post_photos").where({ post_id: id }),
      knex("user_post_comments").where({ post_id: id }),
    ]);

    // Helper function to properly handle image URLs
    const processImageUrl = (url) => {
      if (!url) return null;
      // If it's already a complete URL (starts with http/https), return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Otherwise, prepend the protocol and host for relative URLs
      return `${req.protocol}://${req.get("host")}${url}`;
    };

    const photosWithUrls = photos.map((p) => ({
      ...p,
      image_url: processImageUrl(p.image_url),
    }));

    res.json({
      message: "Post details retrieved successfully for admin.",
      data: { ...post, photos: photosWithUrls, comments },
    });
  } catch (error) {
    console.error("Admin error fetching single post:", error);
    res.status(500).json({ error: "Failed to retrieve post." });
  }
});

adminPostsRouter.post(
  "/",
  validateRequest(adminPostSchema),
  async (req, res) => {
    try {
      const userId = req.user.id || req.user.sub;
      const postData = {
        ...req.validatedData,
        user_id: userId,
      };
      const [newPost] = await knex("user_posts")
        .insert(postData)
        .returning("*");
      res
        .status(201)
        .json({
          message: "Post created successfully by admin.",
          data: newPost,
        });
    } catch (error) {
      console.error("Admin error creating post:", error);
      res.status(500).json({ error: "Failed to create post." });
    }
  }
);

adminPostsRouter.put(
  "/:id",
  validateRequest(adminPostSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [updatedPost] = await knex("user_posts")
        .where({ id })
        .update(req.validatedData)
        .returning("*");
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found." });
      }
      res
        .status(200)
        .json({
          message: "Post updated successfully by admin.",
          data: updatedPost,
        });
    } catch (error) {
      console.error("Admin error updating post:", error);
      res.status(500).json({ error: "Failed to update post." });
    }
  }
);

adminPostsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await knex.transaction(async (trx) => {
      const post = await trx("user_posts").where({ id }).first();
      if (!post) throw new Error("PostNotFound");

      await trx("user_favorites")
        .where({ item_id: id, item_type: "post" })
        .del();
      await trx("user_posts").where({ id }).del();
    });
    res
      .status(200)
      .json({ message: "Post and all related data deleted successfully." });
  } catch (error) {
    console.error("Admin error deleting post:", error);
    if (error.message === "PostNotFound") {
      return res.status(404).json({ error: "Post not found." });
    }
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// --- Nested Router for Post Photos ---
adminPostsRouter.use("/:id/photos", adminPostPhotosRouter);

export default adminPostsRouter;
