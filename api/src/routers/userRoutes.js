import express from "express";
import {
  createUser,
  getUsers,
  login,
} from "../../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Hello,this user router works" });
});

userRouter.get("/users", getUsers);

userRouter.post("/users", createUser);

userRouter.post("/login", login);

export default userRouter;
