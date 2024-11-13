import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

import {
  getUserProfile,
  updateUserDetails,
} from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/profile/:user_id", authenticate, getUserProfile);
usersRouter.put("/update/:user_id/details", authenticate, updateUserDetails);

export default usersRouter;
