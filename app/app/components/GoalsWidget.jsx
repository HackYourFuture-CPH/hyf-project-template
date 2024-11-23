"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { makeRequest } from "../utils/makeRequest.js";

export default function GoalsWidget({
  booksReadCount,
  activeGoal,
  setActiveGoal,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalData, setGoalData] = useState({
    goal_type: activeGoal?.goal_type || "MONTHLY",
    goal_count: activeGoal?.goal_count || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isEditMode && activeGoal) {
      setGoalData({
        goal_type: activeGoal.goal_type,
        goal_count: Number(activeGoal.goal_count),
      });
    }
  }, [isEditMode, activeGoal]);

  const handleSetGoal = async (e) => {
    e.preventDefault();

    if (isNaN(goalData.goal_count) || goalData.goal_count <= 0) {
      console.error("Invalid goal count");
      return;
    }
    setIsSubmitting(true);
    try {
      const newGoal = await makeRequest("/api/goals/add", {
        ...goalData,
        current_count: booksReadCount,
      });

      setActiveGoal(newGoal);
      setIsModalOpen(false);
      setGoalData({ goal_type: "MONTHLY", goal_count: "" });
    } catch (error) {
      console.error("Failed to set goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGoal = () => {
    if (!activeGoal) return;
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    if (isNaN(goalData.goal_count) || goalData.goal_count <= 0) {
      console.error("Invalid goal count");
      return;
    }
    if (!activeGoal) return;
    setIsSubmitting(true);
    try {
      const updatedGoal = await makeRequest(
        `/api/goals/${activeGoal.goal_id}`,
        { goal_count: goalData.goal_count, goal_type: goalData.goal_type },
        "PUT"
      );
      console.log("Updated goal:", updatedGoal);
      setActiveGoal({
        ...activeGoal,
        goal_count: goalData.goal_count,
        goal_type: goalData.goal_type,
        current_count: updatedGoal.current_count || activeGoal.current_count,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to reset goal:", error);
    } finally {
      setIsSubmitting(false);
      setIsEditMode(false);
    }
  };

  const handleRefreshProgress = () => {
    if (!activeGoal) return;

    const refreshedGoal = {
      ...activeGoal,
      current_count: booksReadCount,
    };

    setActiveGoal(refreshedGoal);
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reading Goal
        </Typography>

        {!activeGoal ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 4,
            }}
          >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="body2">
                {activeGoal?.goal_type?.charAt(0) +
                  activeGoal?.goal_type?.slice(1).toLowerCase()}{" "}
                Goal
              </Typography>
              <Typography variant="body2" color="primary">
                {activeGoal.goal_count} Books
              </Typography>
            </Box>

            <Box sx={{ position: "relative", mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={Math.min(
                  (booksReadCount / activeGoal.goal_count) * 100,
                  100
                )}
                size={80}
                thickness={4}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" component="div">
                  {`${Math.round(
                    (booksReadCount / activeGoal.goal_count) * 100
                  )}%`}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {booksReadCount} of {activeGoal.goal_count} books read
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleEditGoal}
              >
                Edit Goal
              </Button>
              <IconButton
                color="primary"
                onClick={handleRefreshProgress}
                title="Refresh Progress"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>

      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={isEditMode ? handleUpdateGoal : handleSetGoal}>
          <DialogTitle>
            {isEditMode ? "Edit Reading Goal" : "Set Reading Goal"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 2,
              }}
            >
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !goalData.goal_count}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Setting..."
                : isEditMode
                ? "Update Goal"
                : "Set Goal"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}
