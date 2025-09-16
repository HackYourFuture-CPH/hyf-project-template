"use client";
import { useState } from "react";
import styles from "./Comment.module.css";

export default function Comment({ postId, commentsData }) {
  const [comments, setComments] = useState(commentsData);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

const handleDelete = async (commentId) => {
  try {
    const res = await fetch(
      `${API_URL}/api/blogposts/${postId}/comments/${commentId}`, // adjust postId if needed
      {
        method: "DELETE",
           headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add your token here
        },
        credentials: "include", // include cookies / auth token if needed
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete comment");
    }

    // Remove the comment from local state after successful deletion
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};


  // 🔹 Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    try {
      

      const res = await fetch(`${API_URL}/api/blogposts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add your token here
        },
        body: JSON.stringify({ content: input }),
        credentials: "include", // if using auth
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      setComments((prev) => [...prev, data.data]); // add new comment
      setInput("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditInput(comments[index]);
  };

  const handleSave = (index) => {
    if (editInput.trim() === "") return;

    setComments((prev) =>
      prev.map((comment, i) => (i === index ? editInput : comment))
    );
    setEditingIndex(null);
    setEditInput("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditInput("");
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
          <button type="submit" className={styles.postBtn}>Post Comment</button>
        </form>

        <ul className={styles.commentList}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.comment}>
              {editingIndex === index ? (
                <>
                  <textarea
                    className={styles.editTextarea}
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                  />
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.saveButton}
                      onClick={() => handleSave(index)}
                    >
                      Save
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.commentText}>{comment.content}</span>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(index)}
                    >
                      ✎ Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(comment.id)}
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
