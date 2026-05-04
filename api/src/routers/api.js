import express from "express";
import eventsRouter from "#routers/events.js";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);

export default apiRouter;