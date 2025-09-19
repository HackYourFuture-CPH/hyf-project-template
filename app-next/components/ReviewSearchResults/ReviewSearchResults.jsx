"use client";

// Inline CSS styles
const styles = {
  loadingContainer: 'loadingContainer',
  spinner: 'spinner',
  errorContainer: 'errorContainer',
  errorIcon: 'errorIcon',
  emptyState: 'emptyState',
  emptyIcon: 'emptyIcon',
  searchResultsContainer: 'searchResultsContainer',
  searchResultsHeader: 'searchResultsHeader',
  reviewsGrid: 'reviewsGrid',
  reviewCard: 'reviewCard',
  reviewHeader: 'reviewHeader',
  reviewAuthor: 'reviewAuthor',
  authorName: 'authorName',
  reviewDate: 'reviewDate',
  reviewStatus: 'reviewStatus',
  statusBadge: 'statusBadge',
  approved: 'approved',
  pending: 'pending',
  reviewContent: 'reviewContent',
  reviewTour: 'reviewTour',
  tourReference: 'tourReference',
  rating: 'rating',
  starFilled: 'starFilled',
  starEmpty: 'starEmpty',
  reviewActions: 'reviewActions',
  actionButton: 'actionButton',
  unapproveButton: 'unapproveButton',
  approveButton: 'approveButton',
  deleteButton: 'deleteButton'
};

const ReviewSearchResults = ({ 
  reviews, 
  isLoading, 
  error, 
  hasSearched, 
  onToggleApproval, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <>
        <style jsx>{`
          .loadingContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            color: #6b7280;
          }

          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Searching reviews...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style jsx>{`
          .errorContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            color: #dc2626;
          }

          .errorIcon {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
        `}</style>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Search Error</h3>
          <p>{error}</p>
        </div>
      </>
    );
  }

  if (hasSearched && reviews.length === 0) {
    return (
      <>
        <style jsx>{`
          .emptyState {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 2rem;
            text-align: center;
            color: #6b7280;
          }

          .emptyIcon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }
        `}</style>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3>No reviews found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      </>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .searchResultsContainer {
          margin-bottom: 2rem;
        }

        .searchResultsHeader {
          margin-bottom: 1.5rem;
        }

        .searchResultsHeader h3 {
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .reviewsGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .reviewCard {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }

        .reviewCard:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .reviewHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .reviewAuthor {
          display: flex;
          flex-direction: column;
        }

        .authorName {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .reviewDate {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .reviewStatus {
          display: flex;
          align-items: center;
        }

        .statusBadge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .statusBadge.approved {
          background-color: #dcfce7;
          color: #166534;
        }

        .statusBadge.pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .reviewContent {
          margin-bottom: 1rem;
        }

        .reviewContent p {
          color: #374151;
          line-height: 1.6;
          margin: 0;
        }

        .reviewTour {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #f9fafb;
          border-radius: 0.5rem;
          border-left: 3px solid #3b82f6;
        }

        .tourReference {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .rating {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          gap: 0.25rem;
        }

        .rating span:first-child {
          font-size: 0.85rem;
          color: #6b7280;
          margin-right: 0.5rem;
        }

        .starFilled {
          color: #fbbf24;
        }

        .starEmpty {
          color: #d1d5db;
        }

        .reviewActions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .actionButton {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .approveButton {
          background-color: #10b981;
          color: white;
        }

        .approveButton:hover {
          background-color: #059669;
        }

        .unapproveButton {
          background-color: #f59e0b;
          color: white;
        }

        .unapproveButton:hover {
          background-color: #d97706;
        }

        .deleteButton {
          background-color: #ef4444;
          color: white;
        }

        .deleteButton:hover {
          background-color: #dc2626;
        }

        @media (max-width: 768px) {
          .reviewsGrid {
            grid-template-columns: 1fr;
          }
          
          .reviewActions {
            flex-direction: column;
          }
        }
      `}</style>
      <div className={styles.searchResultsContainer}>
        <div className={styles.searchResultsHeader}>
          <h3>Search Results ({reviews.length})</h3>
        </div>
        
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewAuthor}>
                  <span className={styles.authorName}>
                    {review.user?.first_name} {review.user?.last_name}
                  </span>
                  <span className={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.reviewStatus}>
                  <span className={`${styles.statusBadge} ${review.is_approved ? styles.approved : styles.pending}`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className={styles.reviewContent}>
                <p>{review.content}</p>
              </div>
              
              <div className={styles.reviewTour}>
                <span className={styles.tourReference}>
                  Tour: {review.tour?.name || 'Unknown Tour'}
                </span>
                {review.rating && (
                  <div className={styles.rating}>
                    <span>Rating: </span>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                        ⭐
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.reviewActions}>
                <button 
                  className={`${styles.actionButton} ${review.is_approved ? styles.unapproveButton : styles.approveButton}`}
                  onClick={() => onToggleApproval(review)}
                >
                  {review.is_approved ? 'Unapprove' : 'Approve'}
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(review)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewSearchResults;
