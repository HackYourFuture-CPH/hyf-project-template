"use client";
import styles from "./BlogCard.module.css";
import { useState } from "react";
import Image from "next/image";

export default function BlogCard({ card }) {
  const [favourite, setFavourite] = useState(card.favourite);

  return (
    <div className={styles.travelCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={card.image}
          alt={card.destination || "Blog image"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{card.title}</h4>
        <div className={styles.meta}>
          by <span>{card.author}</span> • <span>{card.category}</span>
        </div>
        <p className={styles.description}>{card.excerpt}</p>
      </div>
    </div>
  );
}
