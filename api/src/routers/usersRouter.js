import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authenticate.js";

import {
  getUserProfile,
  updateUserDetails,
  deleteUser,
} from "../controllers/usersController.js";

const usersRouter = express.Router();

//Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

usersRouter.put(
  "/update/details",
  authenticate(),
  upload.single("profile"),
  updateUserDetails
);
usersRouter.get("/profile", authenticate(), getUserProfile);
usersRouter.delete("/delete", authenticate("admin"), deleteUser);

export default usersRouter;
