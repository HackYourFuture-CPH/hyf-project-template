import styles from './PostSearchResults.module.css';

const PostSearchResults = ({ 
  posts, 
  isLoading, 
  error, 
  hasSearched, 
  onEdit, 
  onDelete 
}) => {
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
        <span className={styles.resultsCount}>
          {posts.length} results found
        </span>
      </div>
      
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            {/* Post Image */}
            <div className={styles.postImageContainer}>
              {post.photos && post.photos.length > 0 ? (
                <img 
                  src={post.photos[0].image_url} 
                  alt={post.title}
                  className={styles.postImage}
                />
              ) : (
                <div className={styles.postImagePlaceholder}>
                  <i className="fas fa-image"></i>
                  <span>No Image</span>
                </div>
              )}
            </div>
            
            <div className={styles.cardHeader}>
              <div className={styles.postTitle}>
                {post.title}
              </div>
              <div className={styles.postActions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit && onEdit(post)}
                  title="Edit post"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete && onDelete(post)}
                  title="Delete post"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              {post.content && (
                <div className={styles.postContent}>
                  <i className="fas fa-align-left"></i>
                  <span>{post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}</span>
                </div>
              )}
              
              <div className={styles.postDetails}>
                {post.category && (
                  <div className={styles.postCategory}>
                    <i className="fas fa-tag"></i>
                    <span>{post.category}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.postMeta}>
                <span className={styles.postType}>
                  <i className="fas fa-newspaper"></i>
                  Post
                </span>
                {post.likes_count && (
                  <span className={styles.postLikes}>
                    <i className="fas fa-heart"></i>
                    <span>{post.likes_count}</span>
                  </span>
                )}
              </div>
              {post.created_at && (
                <div className={styles.postDate}>
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSearchResults;
