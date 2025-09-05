"use client";
import styles from "./Card.module.css";
import { useState } from "react";
import Image from "next/image";

export default function Card({ card }) {
  const [favourite, setFavourite] = useState(!!card.favourite);

  // Price: backend provides price_usd as minor units (e.g. "455000")
  const priceMinor = Number(card?.price_usd ?? card?.price_minor ?? 0);
  const priceNumber = Number.isFinite(priceMinor) ? priceMinor / 100 : 0;
  const priceFormatted = priceNumber.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currencySymbol = card?.currency_symbol ?? card?.currency_code ?? "";

  const rating = card?.average_rating !== undefined ? Number(card.average_rating) : card?.rating;

  return (
    <div className={styles.travelCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={card?.cover_image_url || "/images/tours/default.jpg"}
          alt={card?.name || "tour image"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{card?.name}</h4>

        <div className={styles.cardDetails}>
          <span className={styles.price}>
            {currencySymbol} {priceFormatted}
          </span>

          <span className={styles.duration}>{card?.duration_days ?? "-"} days</span>

          {rating !== undefined && !Number.isNaN(rating) && (
            <span className={styles.rating}>★ {rating}</span>
          )}

          {card?.capacity !== undefined && (
            <span className={styles.capacity}>{card.capacity} seats</span>
          )}
        </div>

        <p className={styles.description}>{card?.destination ?? card?.description ?? ""}</p>

        <div className={styles.cardFooter}>
          <button
            className={`${styles.heart} ${favourite ? styles.fav : ""}`}
            onClick={() => setFavourite((f) => !f)}
            aria-label={favourite ? "Remove favorite" : "Add to favorites"}
            aria-pressed={favourite}
            type="button"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}