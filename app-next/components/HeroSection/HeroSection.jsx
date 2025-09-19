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
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Make Your Next Group Adventure Unforgettable</h1>
          <p className={styles.subTitle}>
            Easily plan, organize, and share trips with friends and family.
          </p>
        </div>
      </div>
    </section>
  );
}
