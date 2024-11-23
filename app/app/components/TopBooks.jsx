"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "./TopBooks.module.css";

const TopBooks = () => {
    const [topBooks, setTopBooks] = useState([]);
    const [currentBookIndex, setCurrentBookIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopBooks = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/top-books`,
                    {
                        withCredentials: false,
                    }
                );

                // Convert the API response into an array for easier looping
                setTopBooks([
                    { ...response.data.most_favorite_book, label: "Most Favorite Book" },
                    { ...response.data.most_read_book, label: "Most Read Book" },
                    {
                        ...response.data.most_currently_reading_book,
                        label: "Most Currently Reading Book",
                    },
                    { ...response.data.most_wish_list_book, label: "Most Wish to Read Book" },
                ]);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching top books:", err);
                setError("Error fetching top books. Please try again later.");
                setLoading(false);
            }
        };

        fetchTopBooks();
    }, []);

    useEffect(() => {
        if (topBooks.length > 0) {
            const interval = setInterval(() => {
                setCurrentBookIndex((prevIndex) => (prevIndex + 1) % topBooks.length);
            }, 10000);
            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [topBooks]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const currentBook = topBooks[currentBookIndex];

    return (
        <div className={styles.TopBooks}>
            <h2>Top Books of Leaf Notes Users</h2>
            <div className={styles.bookWrapper}>
                {currentBook && (
                    <div className={styles.bookItem}>
                        <Link href={`/books/${currentBook.book_id}`} target="_blank">
                            <img
                                src={currentBook.cover_image || "/placeholder-image.jpg"}
                                alt={currentBook.title}
                                className={styles.bookImage}
                            />
                        </Link>
                        <div className={styles.bookDetails}>
                            <h3>{currentBook.label}</h3>

                            <div>
                                <p>{currentBook.title}</p>
                                <p>{currentBook.author}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBooks;
