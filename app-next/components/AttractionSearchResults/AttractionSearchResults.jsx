import styles from './AttractionSearchResults.module.css';

const AttractionSearchResults = ({ 
  attractions, 
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

  if (hasSearched && attractions.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>
          <i className="fas fa-search"></i>
          <span>No attractions found</span>
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
          {attractions.length} results found
        </span>
      </div>
      
      <div className={styles.attractionsGrid}>
        {attractions.map((attraction) => (
          <div key={attraction.id} className={styles.attractionCard}>
            {/* Attraction Image */}
            <div className={styles.attractionImageContainer}>
              {attraction.photos && attraction.photos.length > 0 ? (
                <img 
                  src={attraction.photos[0].image_url} 
                  alt={attraction.title}
                  className={styles.attractionImage}
                />
              ) : (
                <div className={styles.attractionImagePlaceholder}>
                  <i className="fas fa-landmark"></i>
                  <span>No Image</span>
                </div>
              )}
            </div>
            
            <div className={styles.cardHeader}>
              <div className={styles.attractionTitle}>
                {attraction.title}
              </div>
              <div className={styles.attractionActions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit && onEdit(attraction)}
                  title="Edit attraction"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete && onDelete(attraction)}
                  title="Delete attraction"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              {attraction.content && (
                <div className={styles.attractionContent}>
                  <i className="fas fa-align-left"></i>
                  <span>{attraction.content.length > 150 ? `${attraction.content.substring(0, 150)}...` : attraction.content}</span>
                </div>
              )}
              
              <div className={styles.attractionDetails}>
                {attraction.location && (
                  <div className={styles.attractionLocation}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{attraction.location}</span>
                  </div>
                )}
                
                {attraction.type && (
                  <div className={styles.attractionType}>
                    <i className="fas fa-tag"></i>
                    <span>{attraction.type}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.attractionMeta}>
                <span className={styles.attractionBadge}>
                  <i className="fas fa-landmark"></i>
                  Attraction
                </span>
                {attraction.rating && (
                  <span className={styles.attractionRating}>
                    <i className="fas fa-star"></i>
                    <span>{attraction.rating}/5</span>
                  </span>
                )}
              </div>
              {attraction.created_at && (
                <div className={styles.attractionDate}>
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(attraction.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttractionSearchResults;
