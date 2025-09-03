"use client";
import styles from "./Card.module.css";
import { useState } from "react";
import Image from "next/image";

export default function Card({ card }) {
  const [favourite, setFavourite] = useState(card.favourite);

  return (
    <div className={styles.travelCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={card.image}
          alt={card.destination || "travel image"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{card.destination}</h4>
        <div className={styles.cardDetails}>
          <span className={styles.price}>${card.price}</span>
          <span className={styles.duration}>{card.duration}</span>
          <span className={styles.rating}>
            <span className={styles.star}>★</span> {card.rating}
          </span>
        </div>
        <p className={styles.description}>{card.description}</p>
        <div className={styles.cardFooter}>
          <button
            className={`${styles.heart} ${favourite ? styles.fav : ""}`}
            onClick={() => setFavourite((f) => !f)}
            aria-label="Add to favorites"
            type="button"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}