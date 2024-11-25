import { makeRequest } from "./makeRequest.js";

export const getReviewById = async (id) => {
  return makeRequest(`/api/reviews/${id}`, {}, "GET");
};

export const getUserReview = async (bookId) => {
  return makeRequest(`/api/reviews/book/${bookId}/my-review`, {}, "GET");
};

export const createReview = async (bookId, reviewData) => {
  return makeRequest(`/api/reviews/book/${bookId}`, reviewData, "POST");
};

export const updateReview = async (id, reviewData) => {
  return makeRequest(`/api/reviews/${id}`, reviewData, "PUT");
};

export const deleteReview = async (id) => {
  return makeRequest(`/api/reviews/${id}`, {}, "DELETE");
};
