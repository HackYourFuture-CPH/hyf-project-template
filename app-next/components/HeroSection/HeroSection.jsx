"use client";

import { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";

const images = [
  "/hero-images/dino-reichmuth-A5rCN8626Ck-unsplash.webp",
  "/hero-images/drif-riadh-YpkuRn54y4w-unsplash.webp",
  "/hero-images/jack-anstey-XVoyX7l9ocY-unsplash.webp",
  "/hero-images/neom-STV2s3FYw7Y-unsplash.webp",
  "/hero-images/nils-nedel-ONpGBpns3cs-unsplash.webp",
  "/hero-images/pietro-de-grandi-T7K4aEPoGGk-unsplash.webp",
  "/hero-images/rebe-adelaida-zunQwMy5B6M-unsplash.webp",
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (currentImage >= images.length) {
      setCurrentImage(0);
    }
  }, [images.length, currentImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // When backend is ready, call the API here:
    // const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    // const data = await res.json();
    // Do something with data...
    alert(`Searching for: ${query}`);
  };

  return (
    <section
      id="hero"
      className={styles.hero}
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}>Find your next destination</h1>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchBox}>
            <label htmlFor="search" className={styles.visuallyHidden}>
              Search destinations
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search destinations..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton} aria-label="Search">
              <img src="/icons/magnifier.svg" alt="" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
