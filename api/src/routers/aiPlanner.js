import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

router.post("/", async (req, res) => {
  const { tripId } = req.params;
  const { preferences } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!preferences) {
    return res.status(400).json({ error: "Preferences text is required." });
  }

  try {
    const collaborator = await knex("trip_collaborators")
      .where({ trip_id: tripId, user_id: userId })
      .first();

    const tripOwner = await knex("travel_plans")
      .where({ id: tripId, owner_id: userId })
      .first();

    if (!collaborator && !tripOwner) {
      return res
        .status(403)
        .json({ error: "You do not have permission for this trip." });
    }

    const destination = await knex("tour_destinations")
      .where({ tour_id: tripId })
      .orderBy("stop_order", "asc")
      .first();

    if (!destination) {
      return res
        .status(404)
        .json({ error: "This trip has no destinations set." });
    }

    const attractionsFromDB = await knex("attraction_posts")
      .select("id", "title as name", "content as description")
      .where("location", "ilike", `%${destination.city_name}%`);

    if (attractionsFromDB.length === 0) {
      return res
        .status(404)
        .json({ error: "No attractions found for this destination." });
    }

    const prompt = `
      You are a travel assistant. Analyze the user's preferences for a city and recommend 4-5 attractions from the provided JSON list.
      Respond ONLY with a valid JSON array of objects.

      User Preferences: "${preferences}"
      Destination City: ${destination.city_name}
      Available Attractions: ${JSON.stringify(attractionsFromDB, null, 2)}

      Instructions:
      Based on the preferences, select the most relevant attractions.
      Respond with a JSON array containing ONLY the full objects for the attractions you recommend.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    let suggestedAttractions;
    try {
      const cleanedJsonString = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      suggestedAttractions = JSON.parse(cleanedJsonString);
    } catch (parseError) {
      console.error("Gemini response was not valid JSON:", aiResponseText);
      throw new Error("AI returned a response in an unexpected format.");
    }

    await knex("ai_requests").insert({
      user_id: userId,
      request_text: preferences,
      travel_plan_id: tripId,
    });

    const finalSuggestions = await Promise.all(
      suggestedAttractions.map(async (attraction) => {
        const photo = await knex("attraction_post_photos")
          .where({ post_id: attraction.id })
          .orderBy("uploaded_at", "asc")
          .first();
        return {
          id: attraction.id,
          name: attraction.name,
          image: photo ? photo.image_url : null,
        };
      })
    );

    res.status(200).json({ data: finalSuggestions });
  } catch (error) {
    console.error("AI suggestion feature failed:", error);
    res.status(500).json({ error: "Failed to generate AI suggestions." });
  }
});

export default router;
