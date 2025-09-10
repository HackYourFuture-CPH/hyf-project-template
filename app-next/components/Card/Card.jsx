"use client";
import styles from "./Card.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Card({ card, onFavoriteChange }) {
  const [favourite, setFavourite] = useState(!!card.favourite);

  useEffect(() => {
    setFavourite(!!card.favourite);
    // fallback: if not favorited in card, check localStorage saved favorites
    if (!card.favourite && typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (Array.isArray(saved) && saved.find((f) => (f.itemId || f.item_id) === card.id)) {
          setFavourite(true);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [card.favourite, card.id]);

  // Price: backend provides price_usd as minor units (e.g. "455000")
  const priceMinor = Number(card?.price_usd ?? card?.price_minor ?? 0);
  const priceNumber = Number.isFinite(priceMinor) ? priceMinor / 100 : 0;
  const priceFormatted = priceNumber.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currencySymbol = card?.currency_symbol ?? card?.currency_code ?? "";

  const rating = card?.average_rating !== undefined ? Number(card.average_rating) : card?.rating;

  async function toggleFavorite(e) {
    // stop the click from bubbling to a parent Link and prevent the default anchor navigation
    try {
      e?.stopPropagation?.();
      e?.preventDefault?.();
    } catch (err) {
      // ignore if event absent
    }
    const next = !favourite;

    // optimistic UI
    setFavourite(next);

    // update localStorage fallback immediately
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (next) {
        localStorage.setItem(
          "favorites",
          JSON.stringify([...saved, { itemId: card.id, type: "tour" }])
        );
      } else {
        localStorage.setItem(
          "favorites",
          JSON.stringify(saved.filter((f) => (f.itemId || f.item_id) !== card.id))
        );
      }
    } catch (err) {
      // ignore
    }

    // notify parent
    onFavoriteChange?.({ added: next, itemId: card.id });

    // dispatch global event so other parts of the app (dashboard) can react
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("favoritesChanged", { detail: { added: next, itemId: card.id } })
        );
      }
    } catch (e) {
      // ignore
    }

    // attempt server call; if it fails revert optimistic update and storage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      if (next) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "POST",
          headers,
          body: JSON.stringify({ item_id: card.id, item_type: "tour" }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
      } else {
        // try DELETE /api/favorites/:itemId
        const res = await fetch(`${API_URL}/api/favorites/${card.id}`, {
          method: "DELETE",
          headers,
        });
        if (!res.ok) throw new Error("Failed to remove favorite");
      }
    } catch (err) {
      // revert optimistic update on error
      setFavourite(!next);
      try {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!next) {
          // removal failed -> keep it
          localStorage.setItem(
            "favorites",
            JSON.stringify([...saved, { itemId: card.id, type: "tour" }])
          );
        } else {
          // add failed -> remove from storage
          localStorage.setItem(
            "favorites",
            JSON.stringify(saved.filter((f) => (f.itemId || f.item_id) !== card.id))
          );
        }
      } catch (e) {
        // ignore
      }
      onFavoriteChange?.({ added: !next, itemId: card.id, error: err.message });
      console.error("Favorite toggle failed", err);
    }
  }

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
            onClick={toggleFavorite}
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