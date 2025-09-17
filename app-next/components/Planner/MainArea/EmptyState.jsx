import styles from "./MainArea.module.css";

export default function EmptyState({ destination }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.textContainer}>
        <h2>
          Let's plan the trip to <b>{destination || "your destination"}</b>!
        </h2>
        <p>Add your preferences and click "Get AI Suggestions" to begin.</p>
      </div>
    </div>
  );
}
