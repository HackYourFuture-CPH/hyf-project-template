import express from "express";
import multer from "multer";
import { bucket } from "../utils/cloudStorage.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload-profile", upload.single("profile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const file = bucket.file(`user-profiles/${req.file.originalname}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).send("Upload error");
    });

    stream.on("finish", async () => {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2030",
      });
      res.status(200).send({ message: "File uploaded successfully.", url });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

export default router;
