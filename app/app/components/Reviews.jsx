"use client";
import React, { useState } from "react";
import { Box, Typography, Rating, TextField, Button } from "@mui/material";

const Reviews = ({ initialRating = 0, initialReview = "", onSubmit }) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(rating, review); // Pass the rating and review back to the parent for saving
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Rating Section */}
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

      {/* Review Section */}
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

      {/* Submit Button */}
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
