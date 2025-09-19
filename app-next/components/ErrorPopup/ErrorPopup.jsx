import { useEffect, useState } from 'react';
import styles from './ErrorPopup.module.css';

const ErrorPopup = ({ message, isVisible, onClose, duration = 4000 }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.popup} ${isVisible ? styles.popupVisible : ''}`}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
        <div className={styles.message}>
          <h3 className={styles.title}>Deleted!</h3>
          <p className={styles.text}>{message}</p>
        </div>
        <div className={styles.particles}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
