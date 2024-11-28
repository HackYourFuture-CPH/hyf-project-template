"use client";

import React, { useState } from "react";
import AppLayoutContainer from "../../components/AppLayoutContainer";
import Button from "../../components/Button";
import profileData from "../../data/profileData.json";
import Quote from "../../components/Quote";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
    const [bookRead, setBookRead] = useState("");
    const [currentlyReading, setCurrentlyReading] = useState("");
    const [wishToRead, setWishToRead] = useState("");
    const [quote, setQuote] = useState("");
    const [bookQuote, setBookQuote] = useState("");
    const [authorQuote, setAuthorQuote] = useState("");

    const editFavoriteQuotes = profileData.editFavoriteQuote;

    const handleSave = () => {
        console.log("Profile Saved");
    };

    const handleDiscard = () => {
        console.log("Changes Discarded");
    };

    return (
        <AppLayoutContainer>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <div className={styles.bookshelf}>
                        <h3>Bookshelf</h3>
                        <div className={styles.inputGroup}>
                            <label>Read:</label>
                            <input
                                type="text"
                                placeholder="Enter the title of a book you've read"
                                value={bookRead}
                                onChange={(e) => setBookRead(e.target.value)}
                            />
                            <Button>ADD</Button>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Currently Reading:</label>
                            <input
                                type="text"
                                placeholder="Enter the title of a book you're currently reading"
                                value={currentlyReading}
                                onChange={(e) => setCurrentlyReading(e.target.value)}
                            />
                            <Button>ADD</Button>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Wish to Read:</label>
                            <input
                                type="text"
                                placeholder="Enter the title of a book you want to read"
                                value={wishToRead}
                                onChange={(e) => setWishToRead(e.target.value)}
                            />
                            <Button>ADD</Button>
                        </div>
                    </div>

                    <div className={styles.mostRecentQuotes}>
                        <h3>Most Recent Quotes</h3>
                        <div className={styles.inputGroup}>
                            <label>Enter A Quote That You Recently Read And Liked:</label>
                            <input
                                type="text"
                                placeholder="The Quote"
                                required
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Book:</label>
                            <input
                                type="text"
                                placeholder="Enter the book's name"
                                value={bookQuote}
                                onChange={(e) => setBookQuote(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Author:</label>
                            <input
                                type="text"
                                placeholder="Enter the author's name"
                                value={authorQuote}
                                onChange={(e) => setAuthorQuote(e.target.value)}
                            />
                        </div>
                        <Button>ADD</Button>
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.favoriteQuotes}>
                        <h3>Favorite Quotes</h3>
                        <div className={styles.inputGroup}>
                            <label>Enter A Quote You Like:</label>
                            <input
                                type="text"
                                placeholder="Find Quotes By Keyword"
                                required
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Book:</label>
                            <input
                                type="text"
                                placeholder="The book's name"
                                value={bookQuote}
                                onChange={(e) => setBookQuote(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Author:</label>
                            <input
                                type="text"
                                placeholder="Enter the author's name"
                                value={authorQuote}
                                onChange={(e) => setAuthorQuote(e.target.value)}
                            />
                        </div>
                        <Button>ADD</Button>

                        <Quote favoriteQuotes={editFavoriteQuotes} />
                    </div>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button variant="primary" onClick={handleSave}>
                    SAVE
                </Button>
                <Button variant="secondary" onClick={handleDiscard}>
                    DISCARD
                </Button>
            </div>
        </AppLayoutContainer>
    );
};

export default EditProfile;
