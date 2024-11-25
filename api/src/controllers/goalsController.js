import knex from "../database_client.js";
import { buildGoalDto } from "../services/goalService.js";

export const getUserGoals = async (req, res) => {
  try {
    const goals = await knex("ReadingGoals")
      .where({ user_id: req.user.userId })
      .orderBy("created_at", "desc");

    res.status(200).json({
      goals: goals.map((goal) => buildGoalDto(goal)),
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Error fetching goals" });
  }
};

export const addGoal = async (req, res) => {
  const {
    goal_type,
    goal_count,
    status = "IN_PROGRESS",
    start_date = null,
    end_date = null,
  } = req.body;

  if (!goal_type || !goal_count) {
    return res.status(400).json({ error: "Goal type and count are required" });
  }

  try {
    const existingGoal = await knex("ReadingGoals")
      .where({
        user_id: req.user.userId,
        goal_type: goal_type,
        status: "IN_PROGRESS",
      })
      .first();
    if (existingGoal) {
      return res.status(400).json({ error: "Goal already exists" });
    }

    const [goalId] = await knex("ReadingGoals").insert({
      user_id: req.user.userId,
      goal_type,
      goal_count,
      start_date,
      end_date,
      status,
    });

    const newGoal = await knex("ReadingGoals")
      .where({ goal_id: goalId })
      .first();

    res.status(201).json({
      message: "Goal created successfully",
      goal: buildGoalDto(newGoal),
    });
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ error: "Error adding goal" });
  }
};

export const updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { goal_count } = req.body;

  try {
    const goal = await knex("ReadingGoals")
      .where({
        goal_id: goalId,
        user_id: req.user.userId,
      })
      .first();

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    await knex("ReadingGoals")
      .where({ goal_id: goalId })
      .update({
        goal_count: goal_count || goal.goal_count,
      });

    const updatedGoal = await knex("ReadingGoals")
      .where({ goal_id: goalId })
      .first();

    return res.status(200).json({
      message: "Goal updated successfully",
      goal: buildGoalDto(updatedGoal),
    });
  } catch (err) {
    console.error("Error updating goal:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLatestGoal = async (req, res) => {
  try {
    const latestGoal = await knex("ReadingGoals")
      .where({ user_id: req.user.userId })
      .orderBy("created_at", "desc")
      .first();

    if (!latestGoal) {
      return res.status(404).json({ error: "No goals found" });
    }

    res.status(200).json({ goal: buildGoalDto(latestGoal) });
  } catch (error) {
    console.error("Error fetching latest goal:", error);
    res.status(500).json({ error: "Error fetching latest goal" });
  }
};

export const deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  try {
    const goal = await knex("ReadingGoals")
      .where({
        goal_id: goalId,
        user_id: req.user.userId,
      })
      .first();

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    await knex("ReadingGoals").where({ goal_id: goalId }).del();

    return res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
