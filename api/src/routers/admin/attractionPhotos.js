import express from "express";
import multer from "multer";
import path from "path";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";

const adminAttractionPhotosRouter = express.Router({ mergeParams: true });
adminAttractionPhotosRouter.use(authenticateToken, requireRole(["admin"]));

// --- Multer Configuration for Attraction Photos ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/attractions"),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// POST /api/admin/attractions/:id/photos
adminAttractionPhotosRouter.post(
  "/",
  upload.single("attractionImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded." });
      }
      const { id: attractionId } = req.params;
      const imageUrl = `/images/attractions/${req.file.filename}`;

      const [newPhoto] = await knex("attraction_post_photos")
        .insert({ post_id: attractionId, image_url: imageUrl })
        .returning("*");

      res
        .status(201)
        .json({
          message: "Photo added to attraction successfully.",
          data: newPhoto,
        });
    } catch (error) {
      console.error("Admin error adding photo to attraction:", error);
      res.status(500).json({ error: "Failed to add photo." });
    }
  }
);

// DELETE /api/admin/attractions/:id/photos/:photoId
adminAttractionPhotosRouter.delete("/:photoId", async (req, res) => {
  try {
    const { photoId } = req.params;
    const count = await knex("attraction_post_photos")
      .where({ id: photoId })
      .del();
    if (count === 0) {
      return res.status(404).json({ error: "Photo not found." });
    }
    res.status(200).json({ message: "Photo deleted successfully." });
  } catch (error) {
    console.error("Admin error deleting photo from attraction:", error);
    res.status(500).json({ error: "Failed to delete photo." });
  }
});

export default adminAttractionPhotosRouter;
