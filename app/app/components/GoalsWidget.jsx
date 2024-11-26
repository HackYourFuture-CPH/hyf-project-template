"use client";
import { useState, useEffect } from "react";
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
import { useBookshelf } from "../contexts/BooksReadCountContext";
import { useGoal } from "../contexts/GoalContext";
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
  const [isLoading, setIsLoading] = useState(true);
  const [goalData, setGoalData] = useState({
    goal_type: activeGoal?.goal_type || "MONTHLY",
    goal_count: activeGoal?.goal_count || "",
    start_date:
      activeGoal?.start_date || new Date().toISOString().split("T")[0],
  });
  const [isNewlyCompleted, setIsNewlyCompleted] = useState(false);

  useEffect(() => {
    if (getProgress() === 100 && !isNewlyCompleted) {
      setIsNewlyCompleted(true);
    }
  }, [getProgress()]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeGoal !== undefined) {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeGoal]);

  useEffect(() => {
    if (activeGoal) {
      setGoalData({
        goal_type: activeGoal.goal_type,
        goal_count: activeGoal.goal_count,
        start_date: activeGoal.start_date,
      });
    }
  }, [activeGoal]);

  const handleSetGoal = async (e) => {
    e.preventDefault();
    await setGoal(goalData);
    setIsModalOpen(false);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    await updateGoal(goalData);
    setIsModalOpen(false);
  };
  const handleResetGoal = async () => {
    const resetGoalData = {
      goal_type: activeGoal.goal_type,
      goal_count: booksCount,
      start_date: new Date().toISOString().split("T")[0],
    };
    await setGoal(resetGoalData);
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reading Goal
      </Typography>

      {!activeGoal ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="text.secondary">No active reading goal</Typography>
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
          <CircularProgress
            progress={getProgress() || 0}
            isNewlyCompleted={isNewlyCompleted}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {booksCount} of {activeGoal.goal_count} books read
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getTimeRemaining()} | Ends on: {activeGoal.end_date}
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Goal
            </Button>
            <IconButton color="primary" onClick={handleResetGoal}>
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
              margin="normal"
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
              margin="normal"
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
}
