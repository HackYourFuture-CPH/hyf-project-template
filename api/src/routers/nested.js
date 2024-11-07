import express from "express";
import { createUser, getUsers } from "../../controllers/userController.js"; // Import createUser directly from userController

// This router can be deleted once you add your own router
const nestedRouter = express.Router();

// Define routes
nestedRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

nestedRouter.get("/users", getUsers);

nestedRouter.post("/users", createUser); // Handle POST request to create user

export default nestedRouter;
