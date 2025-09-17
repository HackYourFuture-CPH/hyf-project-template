import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function AccommodationSelector({ selected, onSelectFlights }) {
  return (
    <div className={styles.sidebarModule}>
      <h3>Selected Hotel</h3>
      <ul className={styles.list}>
        {selected ? (
          <li>
            <b>{selected.name}</b>
            <small>${selected.price}/night</small>
          </li>
        ) : (
          <li>No hotel selected yet.</li>
        )}
      </ul>
      <Button onClick={onSelectFlights} disabled={!selected}>
        Next: Select Flights
      </Button>
    </div>
  );
}
