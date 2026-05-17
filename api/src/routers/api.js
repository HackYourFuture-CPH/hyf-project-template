import express from "express";
import eventsRouter from "#routers/events.js";
import cartsRouter from "#routers/carts.js";
import authRouter from "#routers/auth.js";
import ordersRouter from "#routers/orders.js";
import { authenticate, optionalAuthenticate } from "#middlewares/auth.js";

const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);
apiRouter.use("/cart", optionalAuthenticate, cartsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/orders", ordersRouter);

export default apiRouter;
