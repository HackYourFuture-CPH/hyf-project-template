"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Bookshelf.module.css";
import Button from "../components/Button";
import profileData from "../data/profileData.json";

const Bookshelf = () => {
    const { bookShelf } = profileData;
    const router = useRouter(); // Initialize the useRouter hook for navigation

    // Function to handle Edit Bookshelf button click
    const handleEditBookshelf = () => {
        router.push("/profile/edit-profile"); // Navigate to the edit bookshelf page
    };

    return (
        <div className={styles.bookshelf}>
            <div className={styles.bookshelfHeader}>
                <h3>Sam's Bookshelf</h3>
                <Button onClick={handleEditBookshelf}>Edit Profile</Button>{" "}
                {/* On click, navigate to edit page */}
            </div>

            <div className={styles.bookshelfSection}>
                <p>Read:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.read.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`Read Book ${idx + 1}`}
                            className={styles.bookImage}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.bookshelfSection}>
                <p>Currently Reading:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.currentlyReading.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`Currently Reading Book ${idx + 1}`}
                            className={styles.bookImage}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.bookshelfSection}>
                <p>Wish to Read:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.wishToRead.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`Wish to Read Book ${idx + 1}`}
                            className={styles.bookImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bookshelf;
