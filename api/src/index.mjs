// --- CRITICAL: LOAD ENVIRONMENT VARIABLES FIRST ---
import "dotenv/config";

// --- Core Imports ---
import express from "express";
import cors from "cors";
import morgan from "morgan";

// --- Middleware Imports ---
import errorHandler from "./middleware/errorHandler.js";

// --- Public Route Imports ---
import authRouter from "./routers/auth.js";
import usersRouter from "./routers/users.js";
import toursRouter from "./routers/tours.js";
import attractionsRouter from "./routers/attractions.js";
import favoritesRouter from "./routers/favorites.js";
import healthCheckRoute from "./routers/healthCheck.mjs";

import blogpostsRouter from "./routers/blogpost.js";

// --- Admin Route Imports ---
import adminUsersRouter from "./routers/admin/users.js";
import adminToursRouter from "./routers/admin/tours.js";
import adminPostsRouter from "./routers/admin/posts.js";
import adminAttractionsRouter from "./routers/admin/attractions.js";
import adminDashboardRouter from "./routers/admin/dashboard.js";

const app = express();
const PORT = process.env.PORT || 3001;

const apiRouter = express.Router();

// --- Core Middleware Setup ---
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

// --- Optional: Response Body Logger for Debugging ---
const logResponseBody = (req, res, next) => {
  const oldSend = res.send;
  res.send = function (body) {
    const contentType = res.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      console.log("<<-- RESPONSE BODY -->>");
      try {
        console.dir(JSON.parse(body), { depth: null, colors: true });
      } catch (e) {
        // Not a JSON response, ignore.
      }
      console.log("<<------------------->>");
    }
    return oldSend.apply(res, arguments);
  };
  next();
};
app.use(logResponseBody);

// --- API ROUTE SETUP ---
// Health Check
app.use("/api/health", healthCheckRoute);

// Public Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/tours", toursRouter);
app.use("/api/attractions", attractionsRouter);
app.use("/api/favorites", favoritesRouter);

// Authentication routes (no authentication required)
apiRouter.use("/blogposts", blogpostsRouter);

app.use("/api", apiRouter);
// Admin Routes
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/tours", adminToursRouter);
app.use("/api/admin/posts", adminPostsRouter);
app.use("/api/admin/attractions", adminAttractionsRouter);
app.use("/api/admin", adminDashboardRouter);

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
