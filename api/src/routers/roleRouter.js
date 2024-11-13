// routes/dashboard.js

import express from "express";
import authenticateToken from "../../middlewares/authenticateToken.js";
import authorizeRole from "../../middlewares/authorizeRole.js";

const roleRouter = express.Router();

roleRouter.get(
  "/dev",
  authenticateToken,
  authorizeRole("Developer"),
  (req, res) => {
    res.json({ message: "Welcome to the Developer dashboard!" });
  }
);

roleRouter.get(
  "/client",
  authenticateToken,
  authorizeRole("Client"),
  (req, res) => {
    res.json({ message: "Welcome to the Client dashboard!" });
  }
);

export default roleRouter;
