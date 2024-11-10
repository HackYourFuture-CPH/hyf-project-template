import express from "express";

const nestedRouter = express.Router();

nestedRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default nestedRouter;
