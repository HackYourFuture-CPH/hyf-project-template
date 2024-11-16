import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

import {
  getUserProfile,
  updateUserDetails,
  deleteUser,
} from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/profile/:user_id", authenticate(), getUserProfile);
usersRouter.put("/update/:user_id/details", authenticate(), updateUserDetails);
usersRouter.delete("/delete/:user_id", authenticate("admin"), deleteUser);

export default usersRouter;
