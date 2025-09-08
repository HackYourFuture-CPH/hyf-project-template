import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv/config";
import eldersRouter from "./routes/elders.js";
import authRouter from "./routes/authRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import volunteersRouter from "./routes/volunteers.js";
import servicesRouter from "./routes/services.js";
import volunteerServicesRouter from "./routes/volunteerServices.js";
import availableTimeRouter from "./routes/availableTime.js";
import bodyParser from "body-parser";

import reviewsRouter from "./routes/reviews.js";
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
};
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // parse JSON bodies
app.use("/api/auth", authRouter);
// Connect routes
app.use("/api/auth", authRouter);
app.use("/api/address", addressRouter);
app.use("/api/elders", eldersRouter);
app.use("/api/volunteers", volunteersRouter);
app.use("/api/services", servicesRouter);
app.use("/api/volunteer-services", volunteerServicesRouter);
app.use("/api/available-time", availableTimeRouter);
app.use("/api/reviews", reviewsRouter);

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
