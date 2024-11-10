import express from "express";
import login from "../../controllers/authController.js";
import "dotenv/config";

const authRouter = express.Router();
authRouter.post("/login", login);

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
export default authRouter;
