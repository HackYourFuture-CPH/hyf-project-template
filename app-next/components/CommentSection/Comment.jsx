"use client";
import { useEffect, useState } from "react";
import styles from "./Comment.module.css";

export default function Comment({ postId, commentsData = [], resource = "blogposts" }) {
  const [comments, setComments] = useState(Array.isArray(commentsData) ? commentsData : []);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [redirecting, setRedirecting] = useState(false);

  // derive current user id (if available)
  let currentUserId = null;
  try {
    if (token) {
      // require a safe helper - use same decoder logic as other components
      // decode payload
      const parts = token.split(".");
      if (parts.length >= 2) {
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        const json = typeof window !== "undefined" ? atob(padded) : null;
        const obj = json ? JSON.parse(json) : null;
        currentUserId = obj?.id || obj?.sub || obj?.user_id || obj?.userId || null;
      }
    }
  } catch {
    currentUserId = null;
  }

  useEffect(() => {
    // if token is missing, start auto-redirect countdown when user attempts actions
    if (!token) return;
    setRedirecting(false);
  }, [token]);

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`${API_URL}/api/${resource}/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add your token here
        },
        credentials: "include", // include cookies / auth token if needed
      });

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
    if (!token) {
      // Not logged in: start redirect
      setRedirecting(true);
      setTimeout(() => (window.location.href = "/login"), 3000);
      return;
    }
    if (input.trim() === "") return;

    try {
      const res = await fetch(`${API_URL}/api/${resource}/${postId}/comments`, {
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
    setEditInput(comments[index]?.content || "");
  };

  const handleSave = (index) => {
    if (editInput.trim() === "") return;

    setComments((prev) =>
      prev.map((comment, i) => (i === index ? { ...comment, content: editInput } : comment))
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

        {!token ? (
          <div className={styles.loginNotice}>
            <p>You must be logged in to comment.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/login" className={styles.primary}>
                Go to login
              </a>
              <button
                className={styles.secondary}
                onClick={() => {
                  setRedirecting(true);
                  setTimeout(() => (window.location.href = "/login"), 3000);
                }}
              >
                Redirect me
              </button>
            </div>
            {redirecting ? <div className={styles.small}>Redirecting to login...</div> : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              placeholder="Write your comment..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={styles.postBtn}>
              Post Comment
            </button>
          </form>
        )}

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
                    <button className={styles.saveButton} onClick={() => handleSave(index)}>
                      Save
                    </button>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.commentText}>{comment.content}</span>
                  <div className={styles.actionButtons}>
                    {token && String(comment.user_id) === String(currentUserId) ? (
                      <>
                        <button className={styles.editButton} onClick={() => handleEdit(index)}>
                          ✎ Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(comment.id)}
                        >
                          ✕
                        </button>
                      </>
                    ) : null}
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
