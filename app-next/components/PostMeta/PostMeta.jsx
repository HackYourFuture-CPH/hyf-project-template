import { Heart, Share2 } from "lucide-react";
import styles from "./PostMeta.module.css";

export default function PostMeta({ authorName = null, date = null, category = null }) {
  return (
    <div className={styles.postMeta}>
      <div className={styles.authorInfo}>
        <img
          src="https://via.placeholder.com/40"
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.authorDetails}>
          <span className={styles.authorName}>{authorName ?? "Jane Smith"}</span>
          <span className={styles.postDate}>{date ? `Posted on ${date}` : "Posted on 7/15/2024"}</span>
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
