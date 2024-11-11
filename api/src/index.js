import "dotenv/config";

console.log(process.env.GOOGLE_BOOKS_API_KEY);

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import booksRouter from "./routers/booksRouter.js";
import usersRouter from "./routers/usersRouter.js";
import authRouter from "./routers/authRouter.js";
import userBooksRouter from "./routers/userBooksRouter.js";
import searchRouter from "./routers/searchGoogleBooksRouter.js";

const app = express();

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/searchGoogleBooks", searchRouter);
app.use("/api/books", booksRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/api/user-books", userBooksRouter);

app.use("*", (req, res) => {
  console.log("No route matched:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
