"use client";

import React, { useState, useEffect } from "react";
import styles from "./MemorableLines.module.css";

const MemorableQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("http://localhost:3001/quotes/all-quotes");
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote({
        q: randomQuote.quote_text,
        a: randomQuote.author || "Unknown",
      });
    }
  }, [quotes]);
  return (
    <div className={styles.memorableContainer}>
      <h2 className={styles.title}>Memorable Quotes</h2>
      <div className={styles.quoteContainer}>
        {currentQuote ? (
          <>
            <blockquote className={styles.blockquote}>
              “{currentQuote.q}”
            </blockquote>
            <p className={styles.author}>- {currentQuote.a}</p>
          </>
        ) : (
          <p className={styles.errorText}>No quotes available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default MemorableQuotes;
