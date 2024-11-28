"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import AppLayoutContainer from "../components/AppLayoutContainer";
import styles from "./SearchPage.module.css";
const SearchPage = () => {
    return (
        <Suspense>
            <SearchPageContent />
        </Suspense>
    );
};
const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (q) {
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchGoogleBooks`,
                        {
                            params: {
                                query: q,
                                page: 1,
                                pageSize: 10,
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
            fetchSearchResults();
        }
    }, [q]);

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
