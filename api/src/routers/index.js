import express from "express";
import apiRouter from "#routers/api.js";

const rootRouter = express.Router();

rootRouter.use("/api", apiRouter);

export default rootRouter;