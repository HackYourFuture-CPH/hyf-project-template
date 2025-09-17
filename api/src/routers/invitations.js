import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/accept", authenticateToken, async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!token) {
    return res.status(400).json({ error: "Invitation token is required." });
  }

  try {
    const invitation = await knex("trip_invitations")
      .where({ token })
      .andWhere("expires_at", ">", new Date())
      .first();

    if (!invitation) {
      return res
        .status(404)
        .json({ error: "Invitation not found or has expired." });
    }

    const tripOwner = await knex("travel_plans")
      .where({ id: invitation.trip_id, owner_id: userId })
      .first();
    const existingCollaborator = await knex("trip_collaborators")
      .where({ trip_id: invitation.trip_id, user_id: userId })
      .first();

    if (tripOwner || existingCollaborator) {
      return res.status(200).json({
        message: "You are already a member of this trip.",
        data: { tripId: invitation.trip_id },
      });
    }

    await knex("trip_collaborators").insert({
      trip_id: invitation.trip_id,
      user_id: userId,
      permission_level: "editor",
    });

    await knex("trip_invitations").where({ token }).del();

    res.status(200).json({
      message: "You have successfully joined the trip!",
      data: { tripId: invitation.trip_id },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(200).json({
        message: "You are already a member of this trip.",
        data: { tripId: invitation.trip_id },
      });
    }
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Failed to accept invitation." });
  }
});

export default router;
