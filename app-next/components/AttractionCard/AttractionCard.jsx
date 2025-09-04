"use client";
import styles from "./AttractionCard.module.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AttractionCard({ card }) {
  return (
    <Link href={`/attractions/${card.id}`} style={{ textDecoration: "none" }}>
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
            <span>{card.country}</span>
          </div>
          <p className={styles.description}>{card.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
