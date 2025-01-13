import express from "express";
import nestedRouter from "./nested.js";

const mainRouter = express.Router();


mainRouter.get("/", (req, res) => {
  res.json({ message: "Hello from the main route!" });
});


mainRouter.use("/nested", nestedRouter);

export default mainRouter;
