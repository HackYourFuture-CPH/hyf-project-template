"use client";
import styles from "./PostSearchResults.module.css";
import Image from "next/image";
import { useMemo } from "react";
import { getUserIdFromToken } from "../../utils/auth";

const PostSearchResults = ({ posts, isLoading, error, hasSearched, onEdit, onDelete }) => {
  // derive current user id from token (if present)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const currentUserId = useMemo(() => getUserIdFromToken(token), [token]);
  if (isLoading) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (hasSearched && posts.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>
          <i className="fas fa-search"></i>
          <span>No posts found</span>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <span className={styles.resultsCount}>{posts.length} results found</span>
      </div>

      <div className={styles.postsGrid}>
        {posts.map((p) => (
          <div key={p.id} className={styles.postCard}>
            <div className={styles.postImage}>
              {p.cover_image_url || (p.photos && p.photos.length > 0) ? (
                <Image
                  src={p.cover_image_url || p.photos[0].image_url}
                  alt={`${p.title} post`}
                  width={300}
                  height={200}
                  className={styles.postImageFile}
                />
              ) : (
                <div className={styles.postImagePlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.postInfo}>
              <h3 className={styles.postName}>{p.title}</h3>
              <p className={styles.postDescription}>
                {p.content
                  ? p.content.length > 80
                    ? `${p.content.substring(0, 80)}...`
                    : p.content
                  : "No description available"}
              </p>
              <div className={styles.postDetails}>
                <div className={styles.postDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <span>{p.category || "Uncategorized"}</span>
                </div>
                <div className={styles.postDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "Unknown date"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.postActions}>
              {currentUserId && String(p.user_id) === String(currentUserId) ? (
                <>
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit && onEdit(p)}
                    title="Edit post"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete && onDelete(p)}
                    title="Delete post"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSearchResults;
