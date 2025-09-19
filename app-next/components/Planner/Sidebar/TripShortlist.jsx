import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function TripShortlist({ items = [], onStartVote }) {
  return (
    <div className={styles.sidebarModule}>
      <h3>Trip Shortlist ({items.length})</h3>
      <ul className={styles.list}>
        {items.length > 0 ? (
          items.map((item) => <li key={item.id}>{item.name}</li>)
        ) : (
          <li>No items shortlisted.</li>
        )}
      </ul>
      <Button onClick={onStartVote}>Start Vote</Button>
    </div>
  );
}
