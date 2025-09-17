import styles from "./FlightListItem.module.css";
import Button from "../../Button/Button";

export default function FlightListItem({ flight, onSelect, isSelected }) {
  return (
    <div className={`${styles.flightRow} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.airlineInfo}>
        <span className={styles.airlineName}>{flight.name}</span>
        <span className={styles.flightDetails}>{flight.details}</span>
      </div>
      <div className={styles.priceInfo}>
        <span className={styles.price}>${flight.price}</span>
        <Button
          onClick={() => onSelect(flight)}
          disabled={isSelected}
          className={styles.selectButton}
        >
          {isSelected ? "✅ Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
}
