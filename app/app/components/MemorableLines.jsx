"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MemorableLines.module.css";

const MemorableQuotes = () => {
    const [quotes, setQuotes] = useState([]); // Store all quotes
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0); // Track the index of the current quote
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch quotes from the API
    useEffect(() => {
        axios
            .get("https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/quotes") // Using a different CORS proxy
            .then((response) => {
                const data = JSON.parse(response.data.contents);
                setQuotes(data); // Store the quotes in state
                setLoading(false);

                // Set interval to change quote every 20 seconds
                const intervalId = setInterval(() => {
                    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % data.length); // Loop through quotes
                }, 20000); // Change every 20 seconds

                // Clear the interval when component unmounts
                return () => clearInterval(intervalId);
            })
            .catch((error) => {
                console.error("Error fetching quotes:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className={styles.loadingText}>Loading quotes...</p>;

    // Check if quotes are available and currentQuote is defined
    const currentQuote = quotes[currentQuoteIndex];

    return (
        <div className={styles.memorableContainer}>
            <h2 className={styles.title}>Memorable Quotes</h2>
            <div className={styles.quoteContainer}>
                {currentQuote ? (
                    <>
                        <blockquote className={styles.blockquote}>“{currentQuote.q}”</blockquote>
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
