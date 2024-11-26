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
import CircularProgress from "@mui/material/CircularProgress";
import { useBookshelf } from "../contexts/BooksReadCountContext";
import { useGoal } from "../contexts/GoalContext";
import Progress from "./Progress";

export default function GoalsWidget() {
  const {
    activeGoal,
    setGoal,
    updateGoal,
    deleteGoal,
    getProgress,
    getTimeRemaining,
    isSubmitting,
  } = useGoal();

  const calculateEndDate = (startDate, goalType) => {
    const start = new Date(startDate);
    let endDate;
    if (goalType === "MONTHLY") {
      endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (goalType === "ANNUAL") {
      endDate = new Date(start);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    return endDate.toISOString().split("T")[0];
  };

  const { booksCount } = useBookshelf();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goalData, setGoalData] = useState({
    goal_type: activeGoal?.goal_type || "MONTHLY",
    goal_count: activeGoal?.goal_count || 1,
    start_date:
      activeGoal?.start_date || new Date().toISOString().split("T")[0],
    end_date:
      activeGoal?.end_date ||
      calculateEndDate(
        activeGoal?.start_date || new Date().toISOString().split("T")[0],
        activeGoal?.goal_type || "MONTHLY"
      ),
  });
  const [isNewlyCompleted, setIsNewlyCompleted] = useState(false);

  useEffect(() => {
    if (activeGoal) {
      setGoalData({
        goal_type: activeGoal.goal_type || "MONTHLY",
        goal_count: activeGoal.goal_count || 1,
        start_date:
          activeGoal.start_date || new Date().toISOString().split("T")[0],
        end_date:
          activeGoal.end_date ||
          calculateEndDate(
            activeGoal.start_date || new Date().toISOString().split("T")[0],
            activeGoal.goal_type || "MONTHLY"
          ),
      });
    }
  }, [activeGoal]);

  useEffect(() => {
    if (activeGoal !== undefined) {
      setIsLoading(false);
    }
  }, [activeGoal]);

  useEffect(() => {
    if (getProgress() === 100 && !isNewlyCompleted) {
      setIsNewlyCompleted(true);
    }
  }, [getProgress, isNewlyCompleted]);

  const handleGoal = async (e) => {
    e.preventDefault();

    if (activeGoal) {
      await updateGoal(goalData);
    } else {
      await setGoal(goalData);
    }

    setIsModalOpen(false);
  };

  const handleResetGoal = async () => {
    if (!activeGoal) return;

    try {
      await deleteGoal(activeGoal.goal_id);
      console.log("Goal successfully deleted");
    } catch (error) {
      console.error("Failed to reset goal:", error);
    }
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
          <Progress
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
        <form onSubmit={handleGoal}>
          <DialogTitle>
            {activeGoal ? "Edit Reading Goal" : "Set Reading Goal"}
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Goal Type"
              value={goalData.goal_type || "MONTHLY"}
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
              InputProps={{ inputProps: { min: 1 } }}
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
            <TextField
              label="Start Date"
              type="date"
              value={goalData.start_date}
              onChange={(e) =>
                setGoalData((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="End Date"
              type="text"
              value={
                goalData.end_date ||
                calculateEndDate(
                  goalData.start_date || new Date().toISOString().split("T")[0],
                  goalData.goal_type || "MONTHLY"
                )
              }
              disabled
              fullWidth
              margin="normal"
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
