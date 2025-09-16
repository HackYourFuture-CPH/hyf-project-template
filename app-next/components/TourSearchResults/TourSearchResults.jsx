import styles from './TourSearchResults.module.css';
import Image from 'next/image';

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
            <div className={styles.tourImage}>
              {tour.cover_image_url ? (
                <Image
                  src={tour.cover_image_url}
                  alt={`${tour.name} tour`}
                  width={300}
                  height={200}
                  className={styles.tourImageFile}
                />
              ) : (
                <div className={styles.tourImagePlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.tourInfo}>
              <h3 className={styles.tourName}>{tour.name}</h3>
              <p className={styles.tourDescription}>{tour.description || 'No description available'}</p>
              <div className={styles.tourDetails}>
                <div className={styles.tourDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>{tour.duration_days || 0} days</span>
                </div>
                <div className={styles.tourDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <span>${tour.price_minor ? (tour.price_minor / 100).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
            <div className={styles.tourActions}>
              <button 
                className={styles.editButton}
                onClick={() => onEdit && onEdit(tour)}
                disabled={false}
                title="Edit tour"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => onDelete && onDelete(tour)}
                disabled={false}
                title="Delete tour"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourSearchResults;
