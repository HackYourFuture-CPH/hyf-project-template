import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
// apiRouter.get("/", async (req, res) => {
//   const SHOW_TABLES_QUERY =
//     process.env.DB_CLIENT === "pg"
//       ? "SELECT * FROM pg_catalog.pg_tables;"
//       : "SHOW TABLES;";
//   const tables = await knex.raw(SHOW_TABLES_QUERY);
//   res.json({ tables });
// });

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
