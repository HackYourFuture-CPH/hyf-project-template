"use client";

import React, { useState, useEffect } from "react";
import styles from "./VolunteerDetail.module.css";
import { useRouter } from "next/navigation";

const mockVolunteers = [
  {
    id: 1,
    name: "Anna Smith",
    email: "anna@example.com",
    phone_nr: "12345678",
    address: "Copenhagen",
    photo: "/images/volunteer1.jpg",
    services: ["Shopping", "Cooking"],
    gender: "Female",
    routine: "Morning",
    availability: "Weekdays, 9am - 1pm",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone_nr: "87654321",
    address: "Aarhus",
    photo: "/images/volunteer2.jpg",
    services: ["Gardening", "Companionship"],
    gender: "Male",
    routine: "Evening",
    availability: "Weekends, 4pm - 8pm",
  },
];

const VolunteerDetail = ({ volunteerId }) => {
  const [volunteer, setVolunteer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const v = mockVolunteers.find((v) => v.id === Number(volunteerId));
    setVolunteer(v);
  }, [volunteerId]);

  if (!volunteer) return <p>Loading volunteer details...</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Back
      </button>

      <div className={styles.header}>
        <h1>{volunteer.name}</h1>
      </div>

      <div className={styles.details}>
        <div className={styles.imageContainer}>
          {volunteer.photo ? (
            <img src={volunteer.photo} alt={volunteer.name} />
          ) : (
            <div className={styles.placeholder}></div>
          )}
        </div>

        <div className={styles.info}>
          <p>
            <strong>Email:</strong> {volunteer.email}
          </p>
          <p>
            <strong>Phone:</strong> {volunteer.phone_nr}
          </p>
          <p>
            <strong>Address:</strong> {volunteer.address}
          </p>
          <p>
            <strong>Gender:</strong> {volunteer.gender}
          </p>
          <p>
            <strong>Routine:</strong> {volunteer.routine}
          </p>
          <p>
            <strong>Availability:</strong> {volunteer.availability}
          </p>
          <p>
            <strong>Services:</strong> {volunteer.services.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetail;
