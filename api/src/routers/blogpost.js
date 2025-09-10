import express from "express";
import knex from "../db.mjs";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { userPostSchema } from "../validation/schemas.js";
import commentsRouter from "./blogpostComments.js";
import photosRouter from "./blogpostPhotos.js";

const router = express.Router();

// GET /api/blogposts - Get all posts with search, sorting, and optional filtering
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      search = "",
      sort = "created_at-desc",
      page = 1,
      limit = 10,
      category,
    } = req.query;

    const query = knex("user_posts as p")
      .select(
        "p.id",
        "p.title",
        "p.content",
        "p.category",
        "p.created_at",
        "u.username",
        "u.first_name",
        "u.last_name"
      )
      .join("users as u", "p.user_id", "u.id");

    const countQuery = knex("user_posts as p").join(
      "users as u",
      "p.user_id",
      "u.id"
    );

    if (search) {
      const searchTerm = `%${search}%`;
      const searchFilter = (builder) =>
        builder
          .where("p.title", "ilike", searchTerm)
          .orWhere("p.content", "ilike", searchTerm);
      query.where(searchFilter);
      countQuery.where(searchFilter);
    }

    if (category) {
      query.where("p.category", "ilike", category);
      countQuery.where("p.category", "ilike", category);
    }

    const [sortField, sortOrder] = sort.split("-");
    if (
      ["title", "category", "created_at"].includes(sortField) &&
      ["asc", "desc"].includes(sortOrder)
    ) {
      query.orderBy(`p.${sortField}`, sortOrder);
    }

    const totalResult = await countQuery.count("* as count").first();
    const total = parseInt(totalResult.count);

    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    const posts = await query;

    res.json({
      message: "Blogposts retrieved successfully.",
      data: posts,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error fetching blogposts:", error);
    res.status(500).json({
      error: "Blogposts retrieval failed",
      message:
        "We encountered an error while loading the blogposts. Please try again later.",
    });
  }
});
// GET /api/blogposts/my-posts - Get all posts for the logged-in user
router.get("/my-posts", authenticateToken, async (req, res) => {
  const userId = req.user.id || req.user.sub;
  try {
    const myposts = await knex("user_posts")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
    res.json({
      message: "Your blogposts have been retrieved successfully.",
      data: myposts,
    });
  } catch (error) {
    console.error("Error fetching user's blogposts:", error);
    res.status(500).json({ error: "Failed to retrieve your blogposts." });
  }
});

// GET /api/blogposts/:id - Get a single post by ID with photos and comments
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await knex("user_posts as p")
      .select(
        "p.id",
        "p.title",
        "p.content",
        "p.category",
        "p.created_at",
        "u.username",
        "u.first_name",
        "u.last_name"
      )
      .join("users as u", "p.user_id", "u.id")
      .where("p.id", id)
      .first();

    if (!post) {
      return res.status(404).json({ error: "Blogpost not found." });
    }

    const [photos, comments] = await Promise.all([
      knex("user_post_photos").where({ post_id: id }),
      knex("user_post_comments as c")
        .select("c.*", "u.username", "u.first_name", "u.last_name")
        .join("users as u", "c.user_id", "u.id")
        .where({ post_id: id }),
    ]);

    res.json({
      message: "Blogpost retrieved successfully.",
      data: { ...post, photos, comments },
    });
  } catch (error) {
    console.error("Error fetching single blogpost:", error);
    res.status(500).json({ error: "Failed to retrieve blogpost details." });
  }
});

// POST /api/blogposts - Create a new post
router.post(
  "/",
  authenticateToken,
  validateRequest(userPostSchema),
  async (req, res) => {
    try {
      const userId = req.user.id || req.user.sub;
      const [newPost] = await knex("user_posts")
        .insert({ ...req.validatedData, user_id: userId })
        .returning("*");

      res.status(201).json({
        message: "Blogpost created successfully.",
        data: newPost,
      });
    } catch (error) {
      console.error("Error creating blogpost:", error);
      res.status(500).json({ error: "Failed to create blogpost." });
    }
  }
);

// PUT /api/blogposts/:id - Update a post
router.put(
  "/:id",
  authenticateToken,
  validateRequest(userPostSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.sub;

      const [updatedPost] = await knex("user_posts")
        .where({ id, user_id: userId })
        .update(req.validatedData)
        .returning("*");

      if (!updatedPost) {
        return res
          .status(404)
          .json({ error: "Blogpost not found or you do not have permission." });
      }

      res.json({
        message: "Blogpost updated successfully.",
        data: updatedPost,
      });
    } catch (error) {
      console.error("Error updating blogpost:", error);
      res.status(500).json({ error: "Failed to update blogpost." });
    }
  }
);

// DELETE /api/blogposts/:id - Delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    await knex.transaction(async (trx) => {
      const post = await trx("user_posts")
        .where({ id, user_id: userId })
        .first();

      if (!post) {
        throw new Error("BlogpostNotFound");
      }

      await trx("user_post_comments").where({ post_id: id }).del();
      await trx("user_post_photos").where({ post_id: id }).del();
      await trx("user_favorites")
        .where({ item_id: id, item_type: "post" })
        .del();
      await trx("user_posts").where({ id }).del();
    });

    res.status(200).json({ message: "Blogpost deleted successfully." });
  } catch (error) {
    if (error.message === "BlogpostNotFound") {
      return res
        .status(404)
        .json({ error: "Blogpost not found or you do not have permission." });
    }
    console.error("Error deleting blogpost:", error);
    res.status(500).json({ error: "Failed to delete blogpost." });
  }
});

// Nested routers
router.use("/:id/comments", commentsRouter);
router.use("/:id/photos", photosRouter);

export default router;
