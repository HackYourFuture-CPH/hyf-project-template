import styles from './TourSearchResults.module.css';

const TourSearchResults = ({ 
  tours, 
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

  if (hasSearched && tours.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>
          <i className="fas fa-search"></i>
          <span>No tours found</span>
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
          {tours.length} results found
        </span>
      </div>
      
      <div className={styles.toursGrid}>
        {tours.map((tour) => (
          <div key={tour.id} className={styles.tourCard}>
            <div className={styles.cardHeader}>
              <div className={styles.tourName}>
                {tour.name}
              </div>
              <div className={styles.tourActions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit && onEdit(tour)}
                  title="Edit tour"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete && onDelete(tour)}
                  title="Delete tour"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              {tour.description && (
                <div className={styles.tourDescription}>
                  <i className="fas fa-info-circle"></i>
                  <span>{tour.description}</span>
                </div>
              )}
              
              <div className={styles.tourDetails}>
                {tour.destination && (
                  <div className={styles.tourDestination}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{tour.destination}</span>
                  </div>
                )}
                
                {tour.duration_days && (
                  <div className={styles.tourDuration}>
                    <i className="fas fa-clock"></i>
                    <span>{tour.duration_days} days</span>
                  </div>
                )}
                
                {tour.price_minor && (
                  <div className={styles.tourPrice}>
                    <i className="fas fa-dollar-sign"></i>
                    <span>${tour.price_minor}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.tourMeta}>
                <span className={styles.tourType}>
                  <i className="fas fa-map"></i>
                  Tour
                </span>
                {tour.rating && (
                  <span className={styles.tourRating}>
                    <i className="fas fa-star"></i>
                    <span>{tour.rating}/5</span>
                  </span>
                )}
              </div>
              {tour.created_at && (
                <div className={styles.tourDate}>
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(tour.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourSearchResults;
