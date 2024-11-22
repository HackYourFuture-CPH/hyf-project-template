"use client";

import React, { useState, useEffect } from "react";
import styles from "./MemorableLines.module.css";

const MemorableQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const cachedQuotes = localStorage.getItem("allQuotes");

      if (cachedQuotes) {
        const quotes = JSON.parse(cachedQuotes);

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote({
          q: randomQuote.q,
          a: randomQuote.a || "Unknown",
        });
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quotes/all-quotes`
          );
          const data = await response.json();

          localStorage.setItem("allQuotes", JSON.stringify(data));

          const randomQuote = data[Math.floor(Math.random() * data.length)];
          setCurrentQuote({
            q: randomQuote.q,
            a: randomQuote.a || "Unknown",
          });
        } catch (error) {
          console.error("Error fetching quotes:", error);
        }
      }
    };

    fetchQuotes();
  }, []);
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
