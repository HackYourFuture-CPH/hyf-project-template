"use client";

import { useState } from "react";
import { saveReview } from "@/action"; 
const RateUs = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("title", title);
    formData.append("review", review);

    console.log("Submitting review:", { rating, title, review });

    try {
      const result = await saveReview(formData); 
      console.log("Review submitted successfully:", result);

      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      {showThankYou ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-blue-500 mb-4">
            Thank you for your feedback!
          </h2>
          <p className="text-gray-400">
            We appreciate your time and effort to rate us.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Rate Us</h2>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-2xl ${
                  rating >= star ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-400`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mb-4">Tap to rate</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write a review (optional)"
            className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md px-4 py-2 mt-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RateUs;
