import express from "express";
import petsRouter from "./routers/petsRouter.js";
import usersRouter from "./routers/usersRouter.js";

import cors from "cors";

const app = express();

app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Welcome to Pet Pass");
});

app.use(petsRouter);
app.use(usersRouter);

app.listen(() => {
  console.log(`Server is running`);
});
