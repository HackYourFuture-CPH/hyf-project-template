/* import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
}); */


import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import questionRouter from "./routers/questions.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/questions", questionRouter);

app.use("/api/nested", nestedRouter);

const handleNoData = (req, res, next) => {
  if (req.data && req.data.length === 0) {
    return res.status(404).json({ message: "No data found" });
  }
  next();
};

const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
};

app.get("/questions", async (req, res, next) => {
  try {
    const questions = await knex("questions").select("*");

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    next(err);
  }
});

app.use("/api/nested", nestedRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
