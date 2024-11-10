import React from "react";
import styles from "./Search.module.css";
import Button from "./Button";

const Search = () => {
    return (
        <section className={styles.search}>
            <h2 className={styles.searchTitle}>Search for Books</h2>
            <p className={styles.searchDescription}>
                Use our enhanced search to quickly find books from your collection or explore new
                reads through the Google Books API.
            </p>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search for a book by title, author, or ISBN..."
                />
                <Button className={styles.searchButton} variant="primary">
                    SEARCH
                </Button>
            </div>
        </section>
    );
};

export default Search;
