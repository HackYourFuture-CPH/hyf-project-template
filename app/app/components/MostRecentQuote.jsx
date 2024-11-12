import React from "react";
import styles from "./MostRecentQuote.module.css";
import profileData from "../data/profileData.json";

const MostRecentQuote = () => {
    const mostRecentQuotes = profileData.mostRecentQuote;

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
