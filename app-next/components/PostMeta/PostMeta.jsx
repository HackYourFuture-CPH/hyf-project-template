"use client";
import { Heart } from "lucide-react";
import styles from "./PostMeta.module.css";
import cardStyles from "@/components/Card/Card.module.css";
import useFavorite from "@/hooks/useFavorite";

export default function PostMeta({
  authorName = null,
  date = null,
  category = null,
  avatar = null,
  itemId = null,
  itemType = "post",
  onFavoriteChange = null,
}) {
  const name = authorName ?? "Jane Smith";
  const displayDate = date ? `Posted on ${date}` : "Posted on 7/15/2024";
  const avatarSrc = avatar || "https://via.placeholder.com/40";

  const { favourite, toggle, loading } = useFavorite({ itemId, itemType });

  return (
    <div className={styles.postMeta}>
      <div className={styles.authorInfo}>
        <img src={avatarSrc} alt={name} className={styles.avatar} />
        <div className={styles.authorDetails}>
          <span className={styles.authorName}>{name}</span>
          <span className={styles.postDate}>{displayDate}</span>
        </div>
      </div>

      <div className={styles.postActions}>
        {category ? <span className={styles.category}>{category}</span> : null}
        {itemId ? (
          <button
            className={`${cardStyles.heart} ${favourite ? cardStyles.fav : ""}`}
            onClick={(e) => {
              const next = !favourite;
              toggle(e);
              onFavoriteChange?.({ added: next, itemId });
            }}
            aria-label={favourite ? "Remove favorite" : "Add to favorites"}
            aria-pressed={favourite}
            type="button"
            disabled={loading}
          >
            <Heart size={20} fill={favourite ? "currentColor" : "none"} />
          </button>
        ) : (
          <button className={styles.iconButton}>
            <Heart size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
