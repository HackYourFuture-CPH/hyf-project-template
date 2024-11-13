"use client";

import React, { useState } from "react";
import styles from "./Bookshelf.module.css";
import Button from "../components/Button";
import profileData from "../data/profileData.json";
import AddBook from "./AddBook"; // Import the new component

const Bookshelf = () => {
    const { bookShelf } = profileData;
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const [currentCategory, setCurrentCategory] = useState(""); // Track the category being added to

    // Function to handle Add Book button click with category
    const handleAddBookClick = (category) => {
        setCurrentCategory(category); // Set the category
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => setModalOpen(false); // Close the modal

    return (
        <div className={styles.bookshelf}>
            <div className={styles.bookshelfHeader}>
                <h3>Sam's Bookshelf</h3>
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

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("read")}
                    >
                        +
                    </Button>
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

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("currentlyReading")}
                    >
                        +
                    </Button>
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

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("wishToRead")}
                    >
                        +
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button onClick={closeModal} className={styles.closeButton}>
                            &times;
                        </button>
                        <AddBook category={currentCategory} /> {/* Pass the category as a prop */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookshelf;
