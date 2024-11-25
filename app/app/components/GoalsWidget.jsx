"use client";
import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useBookshelf } from "../contexts/BooksReadCountContext.jsx";
import { useGoal } from "../contexts/GoalContext.jsx";
import CircularProgress from "./CircularProgressWithSparkles.jsx";

export default function GoalsWidget() {
  const {
    activeGoal,
    setGoal,
    updateGoal,
    getProgress,
    getTimeRemaining,
    isSubmitting,
  } = useGoal();
  const { booksCount } = useBookshelf();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalData, setGoalData] = useState({
    goal_type: activeGoal?.goal_type || "MONTHLY",
    goal_count: activeGoal?.goal_count || "",
  });

  const handleSetGoal = (e) => {
    e.preventDefault();
    setGoal(goalData);

    const handleUpdateGoal = (e) => {
      e.preventDefault();
      updateGoal(goalData);
    };

    return (
      <Box sx={{ width: "100%", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Reading Goal
        </Typography>

        {!activeGoal ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="text.secondary">
              No active reading goal
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Set a Goal
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <CircularProgress progress={getProgress() || 0} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {booksCount} of {activeGoal.goal_count} books read
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getTimeRemaining()}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Goal
              </Button>
              <IconButton
                color="primary"
                onClick={() =>
                  setGoal({
                    goal_type: activeGoal.goal_type,
                    goal_count: booksCount,
                  })
                }
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
        )}

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <form onSubmit={activeGoal ? handleUpdateGoal : handleSetGoal}>
            <DialogTitle>
              {activeGoal ? "Edit Reading Goal" : "Set Reading Goal"}
            </DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Goal Type"
                value={goalData.goal_type}
                onChange={(e) =>
                  setGoalData((prev) => ({
                    ...prev,
                    goal_type: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="ANNUAL">Annual</MenuItem>
              </TextField>
              <TextField
                label="Number of Books"
                type="number"
                value={goalData.goal_count}
                onChange={(e) =>
                  setGoalData((prev) => ({
                    ...prev,
                    goal_count: Number(e.target.value),
                  }))
                }
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? activeGoal
                    ? "Updating..."
                    : "Setting..."
                  : activeGoal
                  ? "Update Goal"
                  : "Set Goal"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  };
}
