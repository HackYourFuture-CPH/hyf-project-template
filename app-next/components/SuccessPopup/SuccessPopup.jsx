import { useEffect, useState } from 'react';
import styles from './SuccessPopup.module.css';

const SuccessPopup = ({ message, isVisible, onClose, duration = 3000 }) => {
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
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
        <div className={styles.message}>
          <h3 className={styles.title}>Success!</h3>
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

export default SuccessPopup;
