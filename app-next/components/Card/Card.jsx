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
          src={card.cover_image_url || "/images/tours/default.jpg"}
          alt={card.name || "travel image"}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "/images/tours/default.jpg";
          }}
        />
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{card.name}</h4>
        <div className={styles.cardDetails}>
          <span className={styles.price}>
            {card.currency_code} {(Number(card.price_minor) / 100).toLocaleString()}
          </span>
          <span className={styles.duration}>{card.duration_days} days</span>
          {card.rating !== undefined && <span className={styles.rating}>★ {card.rating}</span>}
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
