import { Heart, Share2 } from "lucide-react";
import styles from "./PostMeta.module.css";

export default function PostMeta({ authorName = null, date = null, category = null, avatar = null }) {
  const name = authorName ?? "Jane Smith";
  const displayDate = date ? `Posted on ${date}` : "Posted on 7/15/2024";
  const avatarSrc = avatar || "https://via.placeholder.com/40";

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
        <button className={styles.iconButton}>
          <Heart size={20} />
        </button>
        <button className={styles.iconButton}>
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
