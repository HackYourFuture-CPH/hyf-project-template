import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function ItineraryActions({ onSelectAccommodations }) {
  return (
    <div className={styles.sidebarModule}>
      <h3>Itinerary Complete</h3>
      <p style={{ margin: 0, fontSize: "1rem", color: "#6b7280" }}>
        Your schedule is ready. The next step is to choose your hotel.
      </p>
      <Button onClick={onSelectAccommodations}>Next: Select Hotel →</Button>
    </div>
  );
}
