import express from "express";
import {
  getCartById,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  checkout,
} from "#controllers/carts.js";

const cartsRouter = express.Router();

cartsRouter.get("/", getCartById);
cartsRouter.post("/items", addItemToCart);
cartsRouter.put("/items/:itemId", updateCartItem);
cartsRouter.delete("/items/:itemId", removeCartItem);
cartsRouter.post("/checkout", checkout);

export default cartsRouter;
