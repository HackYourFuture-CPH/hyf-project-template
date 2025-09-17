import styles from "./BookingView.module.css";
import Button from "../Button/Button";

export default function BookingView({
  accommodation,
  flight,
  onPay,
  isLoading,
}) {
  const hotelCost = accommodation ? accommodation.price * 5 : 0;
  const flightCost = flight ? flight.price * 2 : 0;
  const totalCost = hotelCost + flightCost;

  return (
    <div className={styles.bookingPage}>
      <div className={styles.bookingContainer}>
        <h2>Confirm Your Booking</h2>
        <p>Please review your trip details and complete your payment.</p>
        <ul className={styles.costSummary}>
          <li>
            <span>Accommodations</span>
            <span>${hotelCost.toFixed(2)}</span>
          </li>
          <li>
            <span>Flights</span>
            <span>${flightCost.toFixed(2)}</span>
          </li>
          <li className={styles.total}>
            <span>Total</span>
            <span>${totalCost.toFixed(2)}</span>
          </li>
        </ul>
        <div className={styles.mockForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name on Card</label>
            <input type="text" id="name" defaultValue="Alex Doe" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="card">Card Number</label>
            <input type="text" id="card" defaultValue="**** **** **** 1234" />
          </div>
          <Button onClick={onPay} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
