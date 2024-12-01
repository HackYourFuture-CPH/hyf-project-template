import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext"; // Assuming useTheme is used to get the theme
import styles from "./FavoriteQuote.module.css";

const FavoriteQuote = ({ bookId, closeModal }) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme(); // Use theme from context
  const [quoteText, setQuoteText] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!quoteText) {
      setError("Quote text is required.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/add-quote`,
        {
          bookId,
          userId: currentUser.user.id,
          content: quoteText,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error adding quote:", err);
      setError("Failed to add quote.");
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${
        theme === "dark" ? styles.darkMode : ""
      }`}
    >
      {" "}
      {/* Add darkMode class */}
      <div
        className={`${styles.modalContent} ${
          theme === "dark" ? styles.darkMode : ""
        }`}
      >
        <button
          onClick={closeModal}
          className={`${styles.closeButton} ${
            theme === "dark" ? styles.darkMode : ""
          }`}
        >
          &times;
        </button>
        <h2>Add Favorite Quote</h2>
        {error && (
          <p
            className={`${styles.error} ${
              theme === "dark" ? styles.darkMode : ""
            }`}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className={`${styles.success} ${
              theme === "dark" ? styles.darkMode : ""
            }`}
          >
            Quote added successfully!
          </p>
        )}
        <textarea
          placeholder="Enter quote text"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          className={`${styles.textarea} ${
            theme === "dark" ? styles.darkMode : ""
          }`}
        />

        <Button
          onClick={handleSubmit}
          className={`${styles.submitButton} ${
            theme === "dark" ? styles.darkMode : ""
          }`}
        >
          Add Quote
        </Button>
      </div>
    </div>
  );
};

export default FavoriteQuote;
