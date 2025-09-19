"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./TripPlannerCard.module.css";

export default function TripPlannerCard({
  title = "Plan your next trip",
  description = "Create a personalized itinerary and save your favorite places.",
  buttonText = "Open Trip Planner",
  href = "/planner/new",
  imageSrc = "/trip-planner.webp",
  imageAlt = "scenic travel image",
}) {
  return (
    <Link href={href} className={styles.card} aria-label={title}>
      <div className={styles.media}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 600px) 100vw, 400px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
        <div className={styles.actions}>
          <span className={styles.ctaText}>{buttonText}</span>
        </div>
      </div>
    </Link>
  );
}
