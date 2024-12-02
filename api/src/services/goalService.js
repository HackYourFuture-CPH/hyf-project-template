export const buildGoalDto = (goal) => {
  return {
    goal_id: goal.goal_id,
    user_id: goal.user_id,
    goal_type: goal.goal_type,
    goal_count: goal.goal_count,
    status: goal.status,
    start_date: goal.start_date,
    end_date: goal.end_date,
    created_at: goal.created_at,
  };
};
