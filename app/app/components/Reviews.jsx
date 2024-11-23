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
} from "@mui/material";
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

  // Fetch the user's existing review when the component mounts
  useEffect(() => {
    const fetchUserReview = async () => {
      try {
        const review = await getUserReview(bookId);
        setExistingReview(review);
        setRating(review.rating);
        setReviewText(review.review_text);
      } catch (error) {
        console.log("No existing review found.");
        setExistingReview(null);
      }
    };
    fetchUserReview();
  }, [bookId]);

  const handleSubmit = async () => {
    try {
      const reviewData = { rating, review_text: reviewText };

      if (existingReview) {
        console.log("Updating Review:", existingReview.review_id);
        await updateReview(existingReview.review_id, reviewData);
      } else {
        console.log("Creating Review for Book:", bookId);
        await createReview(bookId, reviewData);
      }

      onSuccess();
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message || "Failed to submit the review.");
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting Review:", existingReview.review_id);
      await deleteReview(existingReview.review_id);
      setExistingReview(null);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(error.message || "Failed to delete the review.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {existingReview && !isEditing ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Review
            </Typography>
            <Rating value={rating} readOnly />
            <Typography variant="body1" sx={{ mt: 1 }}>
              {reviewText}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2, mr: 1 }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {existingReview ? "Edit Your Review" : "Add Your Review"}
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
            size="large"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Write your review"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
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
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            {existingReview ? "Update Review" : "Submit Review"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Reviews;
