import "dotenv/config";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./db.mjs";
import nestedRouter from "./routers/nested.js";
import authRouter from "./routers/auth.js";
import postsRouter from "./routers/posts.js";
import usersRouter from "./routers/users.js";
import toursRouter from "./routers/tours.js";
import healthCheckRoute from "./routers/healthCheck.mjs";
import morgan from "morgan";
import favoritesRouter from "./routers/favorites.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const apiRouter = express.Router();

// Health check route
app.use("/api", healthCheckRoute);

apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({
    message: "API is running",
    tables,
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      posts: "/api/posts",
      tours: "/api/tours",
    },
  });
});

// Authentication routes (no authentication required)
apiRouter.use("/auth", authRouter);

// User management routes (authentication required)
apiRouter.use("/users", usersRouter);

// CRUD routes (authentication required)
apiRouter.use("/posts", postsRouter);

// Tours routes (no authentication required)
apiRouter.use("/tours", toursRouter);

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

// global error handler
app.use(errorHandler);

// favorites add, remove
app.use("/api/favorites", favoritesRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
