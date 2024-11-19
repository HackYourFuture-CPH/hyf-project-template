import express from "express";
import login from "../../controllers/authController.js";
import "dotenv/config";

const authRouter = express.Router();
authRouter.post("/login", login);

const blacklistedTokens = [];

authRouter.post("/logout", (req, res) => {
  const token = req.cookies.token;

  if (token) {
    blacklistedTokens.push(token);

    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "No token found" });
  }
});
export default authRouter;
