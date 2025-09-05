import express from "express";
import eldersRouter from "./routes/elders.js";
import volunteersRouter from "./routes/volunteers.js";
import servicesRouter from "./routes/services.js";
import volunteerServicesRouter from "./routes/volunteerServices.js";
import availableTimeRouter from "./routes/availableTime.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();
app.use(express.json()); // parse JSON bodies

// Connect routes
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
