"use client";
import styles from "./AttractionCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import useFavorite from "@/hooks/useFavorite";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AttractionCard({ card, onFavoriteChange }) {
  const initialFav = card.favourite ? true : undefined;
  const { favourite, toggle, loading } = useFavorite({ itemId: card.id, itemType: "attraction", initial: initialFav });
  const raw = card?.cover_image_url;
  const placeholder = card?.id ? `https://picsum.photos/seed/attraction-${card.id}/600/400` : "https://picsum.photos/600/400";

  const normalize = (src) => {
    if (typeof src !== "string" || src.trim() === "") return null;
    const s = src.trim();
    if (s.includes("placehold.co")) {
      const seed = card?.id ? `attraction-${card.id}` : encodeURIComponent(s);
      return `https://picsum.photos/seed/${seed}/600/400`;
    }
    if (s.startsWith("/images/")) return `${API_URL}${s}`;
    // If it's already a complete URL (starts with http/https), return as is
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return s;
  };

  const isBackendPath = typeof raw === "string" && raw.trim().startsWith("/images/") && !raw.trim().startsWith("http://") && !raw.trim().startsWith("https://");
  const initial = isBackendPath ? placeholder : (normalize(raw) || placeholder);
  const [imageSrc, setImageSrc] = useState(initial);

  // HEAD-check backend files to avoid immediate Next.js proxy 404s
  useEffect(() => {
    if (!isBackendPath) return;
    let cancelled = false;
    const url = `${API_URL}${raw}`;
    (async () => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!cancelled && res.ok) setImageSrc(url);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [raw, isBackendPath]);

  // sanitize title (strip trailing hash-like suffix)
  const rawTitle = card.title ?? card.name ?? "Untitled";
  const title = rawTitle.replace(/:\s*[0-9a-f]{6,32}$/i, "").trim();

  return (
    <Link href={`/attractions/${card.id}`} style={{ textDecoration: "none" }}>
      <div className={styles.travelCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={card.destination || title || "Attraction image"}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            onError={() => setImageSrc(placeholder)}
          />
        </div>
        <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>{title}</h4>
          <div className={styles.meta}>
            <span>{title} - {card.location}</span>
          </div>
          <p className={styles.description}>{card.content}</p>
        </div>
        <div className={styles.cardFooter}>
          <button
            className={`${styles.heart} ${favourite ? styles.fav : ""}`}
            onClick={(e) => {
              try {
                e.stopPropagation?.();
                e.preventDefault?.();
              } catch {}
              const next = !favourite;
              toggle(e);
              onFavoriteChange?.({ added: next, itemId: card.id });
            }}
            aria-label={favourite ? "Remove favorite" : "Add to favorites"}
            aria-pressed={favourite}
            type="button"
          >
            <Heart size={18} fill={favourite ? "currentColor" : "none"} stroke="currentColor" />
          </button>
        </div>
      </div>
    </Link>
  );
}
