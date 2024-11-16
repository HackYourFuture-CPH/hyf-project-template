import React from "react";
import styles from "./Quote.module.css";

const Quote = ({ favoriteQuotes }) => {
    // Check if `favoriteQuotes` exists and is an array
    if (!Array.isArray(favoriteQuotes) || favoriteQuotes.length === 0) {
        return <p>No favorite quotes available.</p>;
    }

    return (
        <div>
            {favoriteQuotes.map((quote, idx) => (
                <div key={idx} className={styles.quoteContainer}>
                    <div className={styles.quoteImageContainer}>
                        <img
                            src={quote.src || "/default-quote-image.png"} // Provide a fallback for the image
                            alt="Book cover"
                            className={styles.quoteImage}
                        />
                    </div>
                    <div className={styles.quoteTextContainer}>
                        <blockquote className={styles.quoteText}>“{quote.text}”</blockquote>
                        <p className={styles.quoteAuthor}>- {quote.author || "Unknown Author"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Quote;
