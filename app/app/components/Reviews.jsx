"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Rating, TextField, Button } from "@mui/material";
import { getReviewById, createReview } from "../utils/apiReviews";
import { useAuth } from "../contexts/AuthContext.jsx";

const Reviews = ({ bookId, onSuccess }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const reviewData = { rating, review_text: review };
      const response = await createReview(bookId, reviewData);
      onSuccess(response);
      setRating(0);
      setReview("");
    } catch (error) {
      setError(error.message || "Failed to submit the review.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Rating
      </Typography>
      <Rating
        value={rating}
        onChange={handleRatingChange}
        precision={0.5}
        size="large"
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" gutterBottom>
        Your Review
      </Typography>
      <TextField
        label="Write your review"
        value={review}
        onChange={handleReviewChange}
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
        Submit Review
      </Button>
    </Box>
  );
};

export default Reviews;
