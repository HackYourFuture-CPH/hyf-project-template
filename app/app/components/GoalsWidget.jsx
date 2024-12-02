"use client";
import { useState, useEffect, useMemo } from "react";
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
  Stack,
  useTheme, // Import useTheme hook to access theme
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
    getBooksAfterStartDate,
    calculateEndDate,
    isSubmitting,
  } = useGoal();

  const { booksCount } = useBookshelf();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goalData, setGoalData] = useState({
    goal_type: activeGoal?.goal_type || "MONTHLY",
    goal_count: activeGoal?.goal_count || 1,
    start_date:
      activeGoal?.start_date || new Date().toLocaleDateString("en-CA"),
    end_date:
      activeGoal?.end_date ||
      calculateEndDate(
        activeGoal?.start_date || new Date().toLocaleDateString("en-CA"),
        activeGoal?.goal_type || "MONTHLY"
      ),
  });
  const [isNewlyCompleted, setIsNewlyCompleted] = useState(false);
  const booksReadAfterStartDate = useMemo(
    () => getBooksAfterStartDate(),
    [activeGoal, booksCount]
  );
  const progress = useMemo(() => getProgress(), [activeGoal, booksCount]);

  const theme = useTheme(); // Access the current theme

  useEffect(() => {
    if (isModalOpen && activeGoal) {
      setGoalData({
        goal_type: activeGoal.goal_type,
        goal_count: activeGoal.goal_count,
        start_date: activeGoal.start_date,
        end_date: activeGoal.end_date,
      });
    } else if (isModalOpen) {
      setGoalData({
        goal_type: "MONTHLY",
        goal_count: 1,
        start_date: new Date().toLocaleDateString("en-CA"),
        end_date: calculateEndDate(
          new Date().toLocaleDateString("en-CA"),
          "MONTHLY"
        ),
      });
    }
  }, [isModalOpen, activeGoal]);

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

    try {
      if (activeGoal) {
        await updateGoal(goalData);
      } else {
        await setGoal(goalData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error handling goal:", error);
      setIsLoading(false);
    }
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
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: theme.palette.mode === "dark" ? "#000" : "text.primary", // Set text color to black in dark mode and default in light mode
        }}
      >
        Reading Goal
      </Typography>

      {!activeGoal ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            color: theme.palette.mode === "dark" ? "#000" : "text.secondary", // Check dark mode
          }}
        >
          <Typography>No active reading goal</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsModalOpen(true)}
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000", // Text color: black in light mode, white in dark mode
              backgroundColor:
                theme.palette.mode === "dark" ? "#333" : "#cfc0c0", // Background color: #cfc0c0 in light mode, dark in dark mode
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#555" : "#b0a3a3", // Lighter hover effect for light mode
              },
            }}
          >
            Set a Goal
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Progress
            progress={progress || 0}
            isNewlyCompleted={isNewlyCompleted}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color:
                theme.palette.mode === "dark"
                  ? "#000"
                  : theme.palette.text.secondary,
            }}
          >
            {booksReadAfterStartDate.length} of {activeGoal.goal_count} books
            read
          </Typography>
          <Stack spacing={1}>
            <Typography
              variant="caption"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "#000"
                    : theme.palette.text.secondary,
              }}
            >
              Started:{" "}
              {new Date(activeGoal.start_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "#000"
                    : theme.palette.text.secondary,
              }}
            >
              {getTimeRemaining()} | Ends on:{" "}
              {activeGoal.end_date
                ? new Date(activeGoal.end_date).toLocaleDateString("en-CA")
                : "No end date available"}
            </Typography>
          </Stack>
          <Box
            sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsModalOpen(true)}
              sx={{
                color: theme.palette.mode === "dark" ? "#fff" : "#000", // Text color
                backgroundColor:
                  theme.palette.mode === "dark" ? "#555" : "#e0e0e0", // Background color
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#777" : "#c0c0c0", // Hover color
                },
                borderRadius: "8px", // Rounded corners
                padding: "6px 12px", // Padding
                fontWeight: "bold", // Bold text
              }}
            >
              Edit Goal
            </Button>
            <IconButton
              color="primary"
              onClick={handleResetGoal}
              sx={{
                color: theme.palette.mode === "dark" ? "#fff" : "#000", // Icon color: white in dark mode, black in light mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#444" : "#ddd", // Background color on hover
                  color: theme.palette.mode === "dark" ? "#fff" : "#000", // Icon color on hover
                },
                borderRadius: "50%", // Circular button shape
                padding: "8px", // Increase padding for a more clickable button
              }}
            >
              <RefreshIcon
                sx={{
                  fontSize: "24px", // Adjust icon size
                }}
              />
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
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                  inputMode: "numeric",
                },
              }}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting || !goalData.goal_count || !goalData.start_date
              }
            >
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
