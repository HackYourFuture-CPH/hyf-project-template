import express from "express";
import EventController from "../../controllers/eventController.js";
//import authenticateToken from "../../middlewares/authenticateToken.js";

const eventRouter = express.Router();

eventRouter.post("/", EventController.createEvents);

//adda column for userid, and add that user id in the frontend
eventRouter.get("/:id", EventController.getEventsByUserId);
export default eventRouter;
