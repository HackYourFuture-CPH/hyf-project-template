import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);

authRouter.get("/test", (req, res) => {
  res.send("Hello World!");
});

export default authRouter;
