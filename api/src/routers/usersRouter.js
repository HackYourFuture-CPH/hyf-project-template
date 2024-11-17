import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

import {
  getUserProfile,
  updateUserDetails,
  deleteUser,
} from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/profile", authenticate(), getUserProfile);
usersRouter.put("/update/details", authenticate(), updateUserDetails);
usersRouter.delete("/delete", authenticate("admin"), deleteUser);

export default usersRouter;
