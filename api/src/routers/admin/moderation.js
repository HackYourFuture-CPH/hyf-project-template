import express from "express";
import knex from "../../db.mjs";
import { authenticateToken, requireRole } from "../../middleware/auth.js";
import { z } from "zod";
import { validateRequest } from "../../middleware/validation.js";

const adminModerationRouter = express.Router();
adminModerationRouter.use(authenticateToken, requireRole(["admin"]));

const statusUpdateSchema = z.object({
  status: z.string(),
});

const updateStatus = async (tableName, id, status, res) => {
  try {
    const [updatedItem] = await knex(tableName)
      .where({ id })
      .update({ status })
      .returning("*");

    if (!updatedItem) {
      return res.status(4.04).json({ error: "Item not found." });
    }
    res.json({ message: "Status updated successfully.", data: updatedItem });
  } catch (error) {
    console.error(`Admin error updating status for ${tableName}:`, error);
    res.status(500).json({ error: "Failed to update status." });
  }
};

adminModerationRouter.put(
  "/posts/:id/status",
  validateRequest(statusUpdateSchema),
  (req, res) => {
    updateStatus("user_posts", req.params.id, req.validatedData.status, res);
  }
);

adminModerationRouter.put(
  "/reviews/:id/status",
  validateRequest(statusUpdateSchema),
  (req, res) => {
    updateStatus("tour_reviews", req.params.id, req.validatedData.status, res);
  }
);

adminModerationRouter.put(
  "/blog-comments/:id/status",
  validateRequest(statusUpdateSchema),
  (req, res) => {
    updateStatus(
      "user_post_comments",
      req.params.id,
      req.validatedData.status,
      res
    );
  }
);

adminModerationRouter.put(
  "/attraction-comments/:id/status",
  validateRequest(statusUpdateSchema),
  (req, res) => {
    updateStatus(
      "attraction_post_comments",
      req.params.id,
      req.validatedData.status,
      res
    );
  }
);

export default adminModerationRouter;
