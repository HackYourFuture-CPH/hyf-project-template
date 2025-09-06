"use client";
import styles from "./BlogCard.module.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ card }) {
  const [favourite, setFavourite] = useState(card.favourite);

  return (
    <Link href={`/blogs/${card.id}`} style={{ textDecoration: "none" }}>
   
    <div className={styles.travelCard}>
      <div className={styles.imageWrapper}>
        <Image
          src="https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"
          alt={card.title || "Blog image"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{card.title}</h4>
        <div className={styles.meta}>
          by <span>{card.created_at}</span> • <span>{card.category}</span>
        </div>
        <p className={styles.description}>{card.content}</p>
      </div>
    </div>
     </Link>
  );
}
