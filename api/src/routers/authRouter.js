import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);

export default authRouter;
