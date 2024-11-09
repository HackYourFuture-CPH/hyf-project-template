import express from "express";

import { createUserProfile } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post("/", createUserProfile);

export default usersRouter;
