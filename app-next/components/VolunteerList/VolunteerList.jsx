"use client";

import React, { useState, useEffect } from "react";
import styles from "./VolunteerList.module.css";
import Volunteer from "../Volunteer/Volunteer";

const mockVolunteers = [
  {
    id: 1,
    name: "Anna Smith",
    email: "anna@example.com",
    address: "Copenhagen",
    photo: "/images/volunteer1.jpg",
    services: ["Shopping", "Cooking"],
    availability: "Weekdays, 9am - 1pm",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    address: "Aarhus",
    photo: "/images/volunteer2.jpg",
    services: ["Gardening", "Companionship"],
    availability: "Weekends, 4pm - 8pm",
  },
];

const VolunteersList = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // simulate API fetch
    setTimeout(() => {
      setVolunteers(mockVolunteers);
    }, 500);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Volunteers</h2>
      <div className={styles.grid}>
        {volunteers.map((v) => (
          <Volunteer key={v.id} volunteer={v} />
        ))}
      </div>
    </div>
  );
};

export default VolunteersList;
