"use client";

import { useState, useEffect } from "react";
import styles from "./OfferHelpPage.module.css";

export default function OfferHelpPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const volunteerId = 1;

    try {
      await fetch("/api/volunteer-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteer_id: volunteerId,
          service_id: selectedService,
        }),
      });

      await fetch("/api/available-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteer_id: volunteerId,
          available_from: availableFrom,
          available_to: availableTo,
        }),
      });

      alert("Offer help submitted successfully ✅");
    } catch (error) {
      console.error("Error submitting offer help:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Offer Help</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Choose a service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={styles.input}
            required
          >
            <option value="">-- Select a service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.description}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Available From:</label>
          <input
            type="datetime-local"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Available To:</label>
          <input
            type="datetime-local"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}
