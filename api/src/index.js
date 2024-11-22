import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import booksRouter from "./routers/booksRouter.js";
import usersRouter from "./routers/usersRouter.js";
import authRouter from "./routers/authRouter.js";
import userBooksRouter from "./routers/userBooksRouter.js";
import searchRouter from "./routers/searchGoogleBooksRouter.js";
import quotesRouter from "./routers/quotesRouter.js";
import apiQuotesRouter from "./routers/apiQuotesRouter.js";
import reviewsRouter from "./routers/reviewsRouter.js";
import adminRouter from "./routers/adminRouter.js";
import notesRouter from "./routers/notesRouter.js";
import goalsRouter from "./routers/goalsRouter.js";
import randomBooksRouter from "./routers/randomBooksRouter.js";

const app = express();
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/searchGoogleBooks", searchRouter);
app.use("/api/books", booksRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/api/user-books", userBooksRouter);
app.use("/quotes", quotesRouter);
app.use("/api/quotes", apiQuotesRouter);
app.use("/api/reviews", reviewsRouter);

app.use("/admin", adminRouter);

app.use("/api/random-books", randomBooksRouter);
app.use("/api/notes", notesRouter);

app.use("/api/goals", goalsRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
