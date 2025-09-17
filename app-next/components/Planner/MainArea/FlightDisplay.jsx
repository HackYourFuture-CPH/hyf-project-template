import styles from "./MainArea.module.css";
import FlightListItem from "./FlightListItem/FlightListItem";

export default function FlightDisplay({
  flights = [],
  onSelectFlight,
  selectedFlight,
}) {
  return (
    <div className={styles.displayContainer}>
      <h2>Select Your Flight</h2>
      {flights.map((flight) => (
        <FlightListItem
          key={flight.id}
          flight={flight}
          onSelect={onSelectFlight}
          isSelected={selectedFlight?.id === flight.id}
        />
      ))}
    </div>
  );
}
