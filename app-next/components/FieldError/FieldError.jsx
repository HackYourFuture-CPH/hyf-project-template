import styles from './FieldError.module.css';

const FieldError = ({ error, fieldName }) => {
  if (!error) return null;

  return (
    <div className={styles.fieldError}>
      <div className={styles.errorIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div className={styles.errorContent}>
        {fieldName && <span className={styles.fieldName}>{fieldName}:</span>}
        <span className={styles.errorMessage}>{error}</span>
      </div>
    </div>
  );
};

export default FieldError;
