import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const invitationsRouter = express.Router();
invitationsRouter.use(authenticateToken);

// POST /api/invitations/accept - Accept an invitation
invitationsRouter.post("/accept", async (req, res) => {
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

    // Add user as a collaborator
    await knex("trip_collaborators").insert({
      trip_id: invitation.trip_id,
      user_id: userId,
      permission_level: "editor",
    });

    // Delete the token so it can't be reused
    await knex("trip_invitations").where({ token }).del();

    res
      .status(200)
      .json({
        message: "You have successfully joined the trip!",
        tripId: invitation.trip_id,
      });
  } catch (error) {
    // Handle cases where user is already a member (unique constraint violation)
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "You are already a member of this trip." });
    }
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Failed to accept invitation." });
  }
});

export default invitationsRouter;
