import express from "express";
import { getOrders, getOrderById } from "#controllers/orders.js";
import { authenticate } from "#middlewares/auth.js";

const ordersRouter = express.Router();

// Apply authentication to all order routes
ordersRouter.use(authenticate);

ordersRouter.get("/", getOrders);
ordersRouter.get("/:orderId", getOrderById);

export default ordersRouter;
