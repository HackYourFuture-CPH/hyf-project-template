import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// GET the existing itinerary for a trip
router.get("/", async (req, res) => {
  const { tripId } = req.params;
  try {
    const itinerary = await knex("trip_itineraries")
      .where({ travel_plan_id: tripId })
      .first();

    if (!itinerary) {
      return res
        .status(404)
        .json({ message: "No itinerary found for this trip yet." });
    }
    res.status(200).json({ data: itinerary.itinerary_data });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ error: "Failed to fetch itinerary." });
  }
});

// POST to generate a new itinerary
router.post("/", async (req, res) => {
  const { tripId } = req.params;

  try {
    // 1. Get trip details (duration, etc.)
    const trip = await knex("travel_plans").where({ id: tripId }).first();
    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    // 2. Find the top 5 voted attractions
    const topAttractions = await knex("trip_shortlist_items as tsi")
      .join("attraction_posts as ap", "tsi.attraction_id", "ap.id")
      .leftJoin("trip_votes as tv", "tsi.id", "tv.shortlist_item_id")
      .select("ap.title as name", "ap.content as description")
      .where("tsi.trip_id", tripId)
      .groupBy("ap.id")
      .orderByRaw("COUNT(tv.id) DESC")
      .limit(5);

    if (topAttractions.length === 0) {
      return res
        .status(400)
        .json({ error: "No attractions have been voted on yet." });
    }

    // 3. Construct the prompt for the AI
    const prompt = `
      You are an expert travel itinerary planner.
      A user is planning a trip with the following details:
      - Duration: ${trip.duration_days} days
      - Start Date: ${new Date(trip.start_date).toDateString()}
      - Must-see attractions: ${topAttractions.map((a) => a.name).join(", ")}

      Based on these attractions, create a logical and engaging day-by-day itinerary. Include suggested times and one or two other minor activities or food suggestions per day.
      Respond ONLY with a valid JSON object. The structure must be an array of day objects, where each day object has a "day" number and an array of "activities".
      Example format:
      {
        "itinerary": [
          {
            "day": 1,
            "title": "Arrival and Historic Center",
            "activities": [
              {"time": "10:00 AM", "description": "Visit ${topAttractions[0].name}."},
              {"time": "1:00 PM", "description": "Lunch at a nearby cafe."},
              {"time": "3:00 PM", "description": "Explore the surrounding area."}
            ]
          }
        ]
      }
    `;

    // 4. Call Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    let itineraryJson;
    try {
      const cleanedJsonString = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      itineraryJson = JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Failed to parse AI itinerary response:", aiResponseText);
      throw new Error("AI returned data in an unexpected format.");
    }

    // 5. Save the itinerary to the database (upsert: update if exists, insert if not)
    await knex("trip_itineraries")
      .insert({
        travel_plan_id: tripId,
        itinerary_data: itineraryJson,
      })
      .onConflict("travel_plan_id")
      .merge();

    res.status(201).json({ data: itineraryJson });
  } catch (error) {
    console.error("Itinerary generation failed:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// Modifyies an existing itinerary
router.post("/modify", async (req, res) => {
  const { tripId } = req.params;
  const { command, currentItinerary } = req.body;

  if (!command || !currentItinerary) {
    return res
      .status(400)
      .json({ error: "A command and the current itinerary are required." });
  }

  try {
    const prompt = `
        You are an expert travel itinerary editor. A user wants to modify their existing trip schedule.
        Apply the user's command to the provided JSON itinerary and return the complete, updated itinerary.
        You must respond ONLY with a valid JSON object in the exact same format as the original.
  
        User Command: "${command}"
  
        Current Itinerary JSON:
        ${JSON.stringify(currentItinerary, null, 2)}
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    let newItineraryJson;
    try {
      const cleanedJsonString = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      newItineraryJson = JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error(
        "Failed to parse AI modification response:",
        aiResponseText
      );
      throw new Error("AI returned data in an unexpected format.");
    }

    await knex("trip_itineraries")
      .where({ travel_plan_id: tripId })
      .update({ itinerary_data: newItineraryJson });

    res.status(200).json({ data: newItineraryJson });
  } catch (error) {
    console.error("Itinerary modification failed:", error);
    res.status(500).json({ error: "Failed to modify itinerary." });
  }
});

export default router;
