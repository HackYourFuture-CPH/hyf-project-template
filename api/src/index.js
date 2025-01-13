
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Welcome to the root route of your API!");
});

const apiRouter = express.Router();


apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});


apiRouter.use("/nested", nestedRouter);


app.use("/api", apiRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log(`✅ API listening on port ${process.env.PORT || 3001}`);
});

