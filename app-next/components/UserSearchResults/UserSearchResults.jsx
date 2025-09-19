"use client";
import styles from "./UserSearchResults.module.css";
import Image from "next/image";
import { useMemo } from "react";
import { getUserIdFromToken } from "../../utils/auth";

const UserSearchResults = ({ users, isLoading, error, hasSearched, onEdit, onDelete }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = useMemo(() => !!getUserIdFromToken(token), [token]);
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

  if (hasSearched && users.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>
          <i className="fas fa-search"></i>
          <span>No users found</span>
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
        <span className={styles.resultsCount}>{users.length} results found</span>
      </div>

      <div className={styles.usersGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt={`${user.full_name || user.username} profile`}
                  width={48}
                  height={48}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {(user.first_name || user.username || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user.full_name || user.username}</h3>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.userRole}>
                <span className={`${styles.roleBadge} ${styles[user.role || "user"]}`}>
                  {user.role || "user"}
                </span>
              </div>
            </div>
            <div className={styles.userActions}>
              {isAuthenticated ? (
                <>
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit && onEdit(user)}
                    title="Edit user"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete && onDelete(user)}
                    title="Delete user"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
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

export default UserSearchResults;
