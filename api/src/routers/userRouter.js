import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Hello nested router" });
});

export default userRouter;
