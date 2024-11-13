"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import AppLayoutContainer from "../components/AppLayoutContainer";
import styles from "./SearchPage.module.css";

const SearchPage = () => {
    const searchParams = useSearchParams(); // Use useSearchParams to get query params
    const q = searchParams.get("q") || ""; // Get the search query 'q' parameter from URL

    const [searchResults, setSearchResults] = useState([]); // Store the search results
    const [loading, setLoading] = useState(false); // Loading state for API request
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        if (q) {
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(
                        "http://localhost:3001/api/searchGoogleBooks",
                        {
                            params: {
                                query: q, // Pass the search query to the API
                                page: 1, // You can modify this to support pagination
                                pageSize: 10, // Define the page size (default to 10)
                            },
                        }
                    );
                    setSearchResults(response.data || []);
                } catch (err) {
                    setError("An error occurred while fetching the search results.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchResults(); // Trigger the API call
        }
    }, [q]); // Trigger when 'q' changes

    return (
        <AppLayoutContainer>
            <div className={styles.searchPage}>
                {loading && <p className={styles.loading}>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {q && !loading && !error && (
                    <div className={styles.resultsContainer}>
                        <p className={styles.resultsText}>Results for: "{q}"</p>
                        {searchResults.length > 0 ? (
                            <ul className={styles.resultsList}>
                                {searchResults.map((result, idx) => (
                                    <li key={idx} className={styles.resultItem}>
                                        <a
                                            href={result.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.resultLink}
                                        >
                                            {result.cover_image && (
                                                <img
                                                    src={result.cover_image}
                                                    alt={result.title}
                                                    className={styles.image}
                                                />
                                            )}
                                            <div className={styles.resultContent}>
                                                <h3 className={styles.title}>{result.title}</h3>

                                                <p className={styles.author}>
                                                    {result.authors
                                                        ? result.authors
                                                        : "Unknown Author"}
                                                </p>

                                                <p className={styles.snippet}>
                                                    {result.description}
                                                </p>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No results found.</p>
                        )}
                    </div>
                )}
            </div>
        </AppLayoutContainer>
    );
};

export default SearchPage;
