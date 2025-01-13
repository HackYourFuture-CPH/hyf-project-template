import "dotenv/config";
import express from "express";
import {
  createNewUser,
  findUserDetails,
} from "../../controllers/userController.js";

import { loginHandler } from "../../controllers/authController.js";
import authenticateToken from "../../middlewares/authenticateToken.js";
const authRouter = express.Router();

authRouter.post("/login", loginHandler);
// authRouter.post("logout", logoutHandler);
authRouter.post("/signup", createNewUser);
authRouter.get("/user", authenticateToken, findUserDetails);

export default authRouter;
