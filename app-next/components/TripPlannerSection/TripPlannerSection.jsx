"use client";

import styles from "./TripPlannerSection.module.css";
import TripPlannerCard from "./TripPlannerCard";

export default function TripPlannerSection() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Trip Planner</h2>
        <p className={styles.description}>
          (Plan your next trip with our step-by-step trip planner. Get recommendations and build
          your itinerary.)
        </p>
      </div>
      <TripPlannerCard
        title="Plan your next trip"
        description="Your journey starts with a plan — make it simple, make it smart, make it yours."
        buttonText="Open Trip Planner"
      />
    </div>
  );
}
