import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getAllUsers } from "../controllers/adminController.js";

const adminRouter = express.Router();
adminRouter.use("/users", authenticate("admin"), getAllUsers);

export default adminRouter;
