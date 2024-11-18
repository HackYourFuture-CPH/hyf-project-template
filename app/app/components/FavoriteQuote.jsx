import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";
import styles from "./FavoriteQuote.module.css";

const FavoriteQuote = ({ bookId, userId, onClose }) => {
    const [quoteText, setQuoteText] = useState("");
    const [author, setAuthor] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!quoteText) {
            setError("Quote text is required.");
            return;
        }

        try {
            await axios.post("http://localhost:3001/quotes/add-quote", {
                bookId,
                userId,
                quoteText,
                author,
            });

            setSuccess(true);
            setTimeout(onClose, 1500); // Close modal after success
        } catch (err) {
            console.error("Error adding quote:", err);
            setError("Failed to add quote.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>
                    &times;
                </button>
                <h2>Add Favorite Quote</h2>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Quote added successfully!</p>}
                <textarea
                    placeholder="Enter quote text"
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    className={styles.textarea}
                />
                <input
                    type="text"
                    placeholder="Author (optional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={styles.input}
                />
                <Button onClick={handleSubmit} className={styles.submitButton}>
                    Add Quote
                </Button>
            </div>
        </div>
    );
};

export default FavoriteQuote;
