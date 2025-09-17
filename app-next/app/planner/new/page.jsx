"use client";

import React from "react";
import CreateTripForm from "../../../components/planner/CreateTripForm/CreateTripForm";
import styles from "../[tripId]/planner.module.css";

export default function NewPlannerPage() {
  const onTripCreate = async (tripData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${"http://localhost:3001"}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(tripData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create trip");
      }
      const result = await res.json();
      const newTrip = result.data || result;
      if (newTrip && newTrip.id) {
        // navigate to the planner page for the new trip
        window.location.replace(`/planner/${newTrip.id}`);
      } else {
        // fallback: navigate to planner/new
        window.location.replace(`/planner/new`);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert(`Could not create trip: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create a new trip</h1>
      <CreateTripForm onTripCreate={onTripCreate} />
    </div>
  );
}
