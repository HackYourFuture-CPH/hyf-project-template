import express from "express";

const petRouter = express.Router();

petRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default petRouter;
