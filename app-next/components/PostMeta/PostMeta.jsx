import { Heart, Share2 } from "lucide-react";
import styles from "./PostMeta.module.css";

export default function PostMeta() {
  return (
    <div className={styles.postMeta}>
      <div className={styles.authorInfo}>
        <img
          src="https://via.placeholder.com/40"
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.authorDetails}>
          <span className={styles.authorName}>Jane Smith</span>
          <span className={styles.postDate}>Posted on 7/15/2024</span>
        </div>
      </div>

      <div className={styles.postActions}>
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
