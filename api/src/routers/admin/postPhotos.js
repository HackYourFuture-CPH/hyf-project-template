import express from "express";
import multer from "multer";
import path from "path";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import fs from "fs/promises";

const adminPostPhotosRouter = express.Router({ mergeParams: true });
adminPostPhotosRouter.use(authenticateToken, requireRole(["admin"]));

// --- Multer Configuration for Post Photos ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/posts"),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // req.params.id here refers to the post's ID from the parent router
    cb(
      null,
      `${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// POST /api/admin/posts/:id/photos
adminPostPhotosRouter.post(
  "/",
  upload.single("postImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded." });
      }
      const { id: postId } = req.params;
      const imageUrl = `/images/posts/${req.file.filename}`;

      const [newPhoto] = await knex("user_post_photos")
        .insert({ post_id: postId, image_url: imageUrl })
        .returning("*");

      res
        .status(201)
        .json({ message: "Photo added to post successfully.", data: newPhoto });
    } catch (error) {
      console.error("Admin error adding photo to post:", error);
      res.status(500).json({ error: "Failed to add photo to post." });
    }
  }
);

// DELETE /api/admin/posts/:id/photos/:photoId
adminPostPhotosRouter.delete("/:photoId", async (req, res) => {
  const { photoId } = req.params;
  try {
    await knex.transaction(async (trx) => {
      const photo = await trx("user_post_photos")
        .where({ id: photoId })
        .first();
      if (!photo) {
        throw new Error("PhotoNotFound");
      }

      // Update the database first, then delete the file.
      await trx("user_post_photos").where({ id: photoId }).del();

      if (photo.image_url) {
        const fullPath = path.join(process.cwd(), "public", photo.image_url);
        try {
          await fs.unlink(fullPath);
        } catch (fileError) {
          console.error("Failed to delete post image file:", fileError.message);
        }
      }
    });
    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Admin error deleting photo:", error);
    if (error.message === "PhotoNotFound") {
      return res.status(404).json({ error: "Photo not found." });
    }
    res.status(500).json({ error: "Failed to delete photo." });
  }
});

export default adminPostPhotosRouter;
