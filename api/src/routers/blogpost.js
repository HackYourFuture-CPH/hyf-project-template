import express from "express";
import knex from "../db.mjs";
const router = express.Router();








// GET all blogposts
router.get("/", async (req, res) => {

  try {
    // Build the base query
    let query = knex("user_posts as up").select("*");

    const blogposts = await query;

    res.json({
      message: "Blogposts retrieved successfully",
      data: blogposts,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      error: "Blogposts retrieval failed",
      message:
        "We encountered an error while loading the blogpposts. Please try again later.",
    });
  }
});

// GET single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await knex("user_posts").where({ id }).first();

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
        message: "We couldn't find the blog you're looking for.",
      });
    }

    res.json({
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      error: "Blog retrieval failed",
      message:
        "We encountered an error while loading the blog. Please try again later.",
    });
  }
});





export default router;