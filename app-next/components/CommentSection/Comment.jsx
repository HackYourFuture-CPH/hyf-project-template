"use client";
import { useState } from "react";
import styles from "./Comment.module.css";

export default function Comment() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const handleDelete = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    setComments((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className={`${styles.commentBox}`}>
      <div className={styles.commentsContainer}>
        <h3>Comments</h3>
        <h4>Leave a Reply</h4>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            placeholder="Write your comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Post Comment</button>
        </form>

        <ul className={styles.commentList}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.comment}>
              <span className={styles.commentText}>{comment}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(index)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
