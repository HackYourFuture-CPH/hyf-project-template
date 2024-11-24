import { makeRequest } from "./makeRequest.js";

// Fetch Review by ID
export const getReviewById = async (id) => {
  return makeRequest(`/api/reviews/${id}`, {}, "GET");
};

export const getUserReview = async (bookId) => {
  return makeRequest(`/api/reviews/book/${bookId}/my-review`, {}, "GET");
};

// Create Review
export const createReview = async (bookId, reviewData) => {
  return makeRequest(`/api/reviews/book/${bookId}`, reviewData, "POST");
};

// Update Review
export const updateReview = async (id, reviewData) => {
  return makeRequest(`/api/reviews/${id}`, reviewData, "PUT");
};

// Delete Review
export const deleteReview = async (id) => {
  return makeRequest(`/api/reviews/${id}`, {}, "DELETE");
};
