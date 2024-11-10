import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import booksRouter from "./routers/booksRouter.js";
import usersRouter from "./routers/usersRouter.js";
import authRouter from "./routers/authRouter.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/books", booksRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
