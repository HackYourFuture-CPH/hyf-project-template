import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import booksRouter from "./routers/booksRouter.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/books", booksRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
