import styles from './CommentSearchResults.module.css';

const CommentSearchResults = ({ 
  comments, 
  isLoading, 
  error, 
  hasSearched, 
  onToggleApproval, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Searching comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Search Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (hasSearched && comments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3>No comments found</h3>
        <p>Try adjusting your search terms</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className={styles.searchResultsContainer}>
      <div className={styles.searchResultsHeader}>
        <h3>Search Results ({comments.length})</h3>
      </div>
      
      <div className={styles.commentsGrid}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <div className={styles.commentAuthor}>
                <span className={styles.authorName}>
                  {comment.user?.first_name} {comment.user?.last_name}
                </span>
                <span className={styles.commentDate}>
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.commentStatus}>
                <span className={`${styles.statusBadge} ${comment.is_approved ? styles.approved : styles.pending}`}>
                  {comment.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className={styles.commentContent}>
              <p>{comment.content}</p>
            </div>
            
            <div className={styles.commentPost}>
              <span className={styles.postReference}>
                On: {comment.post?.title || 'Unknown Post'}
              </span>
            </div>
            
            <div className={styles.commentActions}>
              <button 
                className={`${styles.actionButton} ${comment.is_approved ? styles.unapproveButton : styles.approveButton}`}
                onClick={() => onToggleApproval(comment)}
              >
                {comment.is_approved ? 'Unapprove' : 'Approve'}
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => onDelete(comment)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSearchResults;
