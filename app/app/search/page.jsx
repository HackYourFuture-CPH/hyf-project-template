"use client"; // Ensure the component is a client component

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Use next/navigation for client-side query params
import axios from "axios";
import AppLayoutContainer from "../components/AppLayoutContainer";
import styles from "./SearchPage.module.css"; // Import the CSS styles

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
                    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
                        params: {
                            key: "AIzaSyBjgopHT_chdiy-WJ6Vsv2wFUVyJ8Ahlhw", // Replace with your Google API key
                            cx: "b54c016a790c94e6d", // Replace with your Custom Search Engine ID
                            q: q, // The query parameter from URL
                        },
                    });
                    setSearchResults(response.data.items || []);
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
                                            {result.pagemap?.cse_image?.[0]?.src && (
                                                <img
                                                    src={result.pagemap?.cse_image?.[0]?.src}
                                                    alt={result.title}
                                                    className={styles.image}
                                                />
                                            )}
                                            <div className={styles.resultContent}>
                                                <h3 className={styles.title}>{result.title}</h3>
                                                <p className={styles.snippet}>{result.snippet}</p>
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
