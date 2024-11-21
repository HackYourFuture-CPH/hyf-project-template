import express from "express";
import EventController from "../../controllers/eventController.js";
//import authenticateToken from "../../middlewares/authenticateToken.js";

const eventRouter = express.Router();

eventRouter.post("/", EventController.createEvents);

export default eventRouter;
