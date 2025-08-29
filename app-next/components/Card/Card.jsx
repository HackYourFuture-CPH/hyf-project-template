"use client";
import Link from "next/link";
import styles from "./Card.module.css";
import { useState } from "react";
import Image from "next/image";

export default function Card({ card }) {
  const [rating, setRating] = useState(card.rating);
  const [favourite, setFavourite] = useState(false);
  return (
    <>
      <div className={`container`}>
        <div className={styles.travelCard}>
         <Image src={card.image} alt="travel image" height={100} width={100} />
          <h3>{card.destination}</h3>
          <p className={styles.description}>{card.description}</p>

          <div className={styles.cardFooter}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= rating ? styles.filledStar : styles.emptyStar
                  }
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <span
              className={`${styles.heart} ${favourite ? styles.fav : ""}`}
              onClick={() => setFavourite(!favourite)}
            >
              ♥
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
