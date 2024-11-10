import React from "react";
import styles from "./MostRecentQuote.module.css"; // Import styles for the component
import profileData from "../data/profileData.json"; // Import the JSON data

const MostRecentQuote = () => {
    const mostRecentQuotes = profileData.mostRecentQuote; // Access the entire array of mostRecentQuote

    return (
        <div>
            {mostRecentQuotes.map((quote, idx) => (
                <div key={idx} className={styles.quoteContainer}>
                    <div className={styles.quoteContent}>
                        <p className={styles.quoteText}>"{quote.quoteText}"</p>
                        <p className={styles.bookTitle}>Book: {quote.book}</p>
                        <p className={styles.author}>- {quote.author}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MostRecentQuote;
