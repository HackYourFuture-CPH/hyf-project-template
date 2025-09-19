import styles from './AttractionSearchResults.module.css';
import Image from 'next/image';

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
        {attractions.map((a) => (
          <div key={a.id} className={styles.attractionCard}>
            <div className={styles.attractionImage}>
              {a.photos && a.photos.length > 0 ? (
                <Image
                  src={a.photos[0].image_url}
                  alt={`${a.title} attraction`}
                  width={300}
                  height={200}
                  className={styles.attractionImageFile}
                />
              ) : (
                <div className={styles.attractionImagePlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.attractionInfo}>
              <h3 className={styles.attractionName}>{a.title}</h3>
              <p className={styles.attractionDescription}>{a.content ? (a.content.length > 80 ? `${a.content.substring(0, 80)}...` : a.content) : 'No description available'}</p>
              <div className={styles.attractionDetails}>
                <div className={styles.attractionDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{a.location || 'Unknown location'}</span>
                </div>
                <div className={styles.attractionDetail}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <span>{a.type || 'Uncategorized'}</span>
                </div>
              </div>
            </div>
            <div className={styles.attractionActions}>
              <button 
                className={styles.editButton}
                onClick={() => onEdit && onEdit(a)}
                title="Edit attraction"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => onDelete && onDelete(a)}
                title="Delete attraction"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttractionSearchResults;
