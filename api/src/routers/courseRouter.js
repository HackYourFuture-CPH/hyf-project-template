import "dotenv/config";
import express from "express";
import { createCourse } from "../../controllers/courseController";
import { createLecture } from "../../controllers/lectureController";
import authenticateToken from "../../middlewares/authenticateToken";
import authorizeRole from "../../middlewares/authorizeRole";
const courseRouter = express.Router();

courseRouter.post(
  "/",
  authenticateToken,
  authorizeRole("instructor"),
  createCourse
);

courseRouter.post("/:courseId/lectures", authenticateToken, authorizeRole("instructor"),createLecture);

export default courseRouter;
