import { makeRequest } from "./makeRequest";

// Fetch Review by ID
export const getReviewById = async (id) => {
  return makeRequest(`/reviews/${id}`, {}, "GET");
};

// Create Review
export const createReview = async (bookId, reviewData) => {
  return makeRequest(`/reviews/book/${bookId}`, reviewData, "POST");
};

// Update Review
export const updateReview = async (id, reviewData) => {
  return makeRequest(`/reviews/${id}`, reviewData, "PUT");
};

// Delete Review
export const deleteReview = async (id) => {
  return makeRequest(`/reviews/${id}`, {}, "DELETE");
};
