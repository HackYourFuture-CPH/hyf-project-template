import React from "react";
import styles from "./Quote.module.css";

const Quote = ({ favoriteQuotes }) => {
    return (
        <div>
            {favoriteQuotes.map((quote, idx) => (
                <div key={idx} className={styles.quoteContainer}>
                    <div className={styles.quoteImageContainer}>
                        <img src={quote.src} alt="Book cover" className={styles.quoteImage} />
                    </div>
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

export default Quote;
