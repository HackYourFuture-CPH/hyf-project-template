"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getUserReview,
  createReview,
  updateReview,
  deleteReview,
} from "../utils/apiReviews";

const Reviews = ({ bookId, onSuccess }) => {
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchUserReview = async () => {
      try {
        const review = await getUserReview(bookId);
        setExistingReview(review);
        setRating(review.rating);
        setReviewText(review.review_text);
        setIsDeleted(false);
      } catch (error) {
        setExistingReview(null);
      }
    };
    fetchUserReview();
  }, [bookId]);

  const handleSubmit = async () => {
    if (!reviewText || !rating) {
      setError("Missing required fields");
      return;
    }
    try {
      const reviewData = { rating, review_text: reviewText };

      if (existingReview) {
        await updateReview(existingReview.review_id, reviewData);
      } else {
        const newReview = await createReview(bookId, reviewData);
        setExistingReview(newReview);
      }
      onSuccess();
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message || "Failed to submit the review.");
    }
  };

  const handleDelete = async () => {
    try {
      setExistingReview(null);
      setRating(0);
      setReviewText("");

      await deleteReview(existingReview.review_id);
    } catch (error) {
      setError(error.message || "Failed to delete the review.");
    }
  };

  const openDialog = (actionType) => {
    setAction(actionType);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (action === "edit") {
      setIsEditing(true);
    } else if (action === "delete") {
      handleDelete();
    }
    setDialogOpen(false);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
    if (error) setError("");
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (error) setError("");
  };

  return (
    <Box sx={{ mt: 2 }}>
      {existingReview && !isEditing ? (
        <Card sx={{ mb: 2, position: "relative" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Review
            </Typography>
            <Box
              sx={{
                position: "relative",
                "&:hover .hover-icons": {
                  opacity: 1,
                },
              }}
            >
              <Rating value={rating} readOnly />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {reviewText}
              </Typography>

              <Box
                className="hover-icons"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  display: "flex",
                  gap: 1,
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                <IconButton color="primary" onClick={() => openDialog("edit")}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => openDialog("delete")}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {isDeleted
              ? "Add Your Review"
              : existingReview
              ? "Edit Your Review"
              : "Add Your Review"}
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => handleRatingChange(newValue)}
            precision={0.5}
            size="large"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Write your review"
            value={reviewText}
            onChange={handleReviewTextChange}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "#d5b4b4",
              "&:hover": {
                bgcolor: "#867070",
              },
            }}
          >
            {existingReview ? "Update Review" : "Submit Review"}
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {action === "edit"
              ? "Are you sure you want to edit this review?"
              : "Are you sure you want to delete this review?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmAction}
            color={action === "delete" ? "error" : "primary"}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;
