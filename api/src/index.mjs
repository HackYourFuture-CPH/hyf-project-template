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
import tripsRouter from "./routers/trips.js";
import tripPlannerRouter from "./routers/tripPlanner.js";
import BookingsRouter from "./routers/bookings.js";

import attractionsRouter from "./routers/attractions.js";
import favoritesRouter from "./routers/favorites.js";
import healthCheckRoute from "./routers/healthCheck.mjs";
import invitationsRouter from "./routers/invitations.js";
import blogpostsRouter from "./routers/blogpost.js";

// --- Admin Route Imports ---
import adminUsersRouter from "./routers/admin/users.js";
import adminToursRouter from "./routers/admin/tours.js";
import adminPostsRouter from "./routers/admin/posts.js";
import adminAttractionsRouter from "./routers/admin/attractions.js";
import adminCommentsRouter from "./routers/admin/comments.js";
import adminReviewsRouter from "./routers/admin/reviews.js";
import adminDashboardRouter from "./routers/admin/dashboard.js";
import adminBookingsRouter from "./routers/admin/bookings.js";
import adminTripsRouter from "./routers/admin/trips.js";
import adminModerationRouter from "./routers/admin/moderation.js";

const app = express();

// CORS configuration for frontend at localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
const PORT = process.env.PORT || 3001;

const apiRouter = express.Router();

// --- Core Middleware Setup ---
//app.use(cors());
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
app.use("/api/trips", tripsRouter);
app.use("/api/trip-options", tripPlannerRouter);
app.use("/api/bookings", BookingsRouter);
app.use("/api/attractions", attractionsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/invitations", invitationsRouter);

// Authentication routes (no authentication required)
apiRouter.use("/blogposts", blogpostsRouter);

app.use("/api", apiRouter);
// Admin Routes
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/tours", adminToursRouter);
app.use("/api/admin/posts", adminPostsRouter);
app.use("/api/admin/attractions", adminAttractionsRouter);
app.use("/api/admin/comments", adminCommentsRouter);
app.use("/api/admin/reviews", adminReviewsRouter);
app.use("/api/admin", adminDashboardRouter);
app.use("/api/admin/bookings", adminBookingsRouter);
app.use("/api/admin/trips", adminTripsRouter);
app.use("/api/admin/moderate", adminModerationRouter);

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
