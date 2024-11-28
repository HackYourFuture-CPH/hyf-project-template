import express from "express";
import {
  addGoal,
  updateGoal,
  deleteGoal,
  getUserGoals,
  getLatestGoal,
} from "../controllers/goalsController.js";
import { authenticate } from "../middlewares/authenticate.js";

const goalsRouter = express.Router();

//protect all routes
goalsRouter.use(authenticate());

goalsRouter.get("/", getUserGoals);
goalsRouter.get("/latest", getLatestGoal);
goalsRouter.post("/add", addGoal);
goalsRouter.put("/:goalId", updateGoal);
goalsRouter.delete("/:goalId", deleteGoal);

export default goalsRouter;
