"use client";
import { useState } from "react";
import styles from "./CreateTripForm.module.css";
import Button from "../Button/Button";

export default function CreateTripForm({ onTripCreate }) {
  const [tripName, setTripName] = useState("Summer Trip to Paris");
  const [destination, setDestination] = useState("Paris, France");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!tripName || !destination || !startDate || !endDate) {
      alert("Please fill out all fields.");
      return;
    }
    const tripData = { name: tripName, destination, startDate, endDate };
    try {
      setIsCreating(true);
      await onTripCreate(tripData);
    } catch (err) {
      console.error("CreateTripForm: error creating trip", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.createTripContainer}>
        <h1>Create Your Trip</h1>
        <p className={styles.subtitle}>
          Fill out the details below to get started with your next adventure.
        </p>
        <div className={styles.formGroup}>
          <label htmlFor="trip-name">Trip Name</label>
          <input
            id="trip-name"
            type="text"
            placeholder="e.g., Summer Trip to Paris"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            type="text"
            placeholder="e.g., Paris, France"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.dateInputs}`}>
          <div style={{ flex: 1 }}>
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} aria-busy={isCreating}>
          {isCreating ? "Creating..." : "Create Trip & Start Planning →"}
        </Button>
      </div>
    </div>
  );
}
