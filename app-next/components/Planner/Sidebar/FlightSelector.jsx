import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function FlightSelector({ selected, onFinalize }) {
  return (
    <div className={styles.sidebarModule}>
      <h3>Selected Flights</h3>
      <ul className={styles.list}>
        {selected ? (
          <li>
            <b>{selected.name}</b>
            <small>${selected.price} per person</small>
          </li>
        ) : (
          <li>No flight selected yet.</li>
        )}
      </ul>
      <Button onClick={onFinalize} disabled={!selected}>
        Finalize & Book
      </Button>
    </div>
  );
}
