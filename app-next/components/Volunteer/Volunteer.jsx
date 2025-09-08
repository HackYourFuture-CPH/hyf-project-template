import React from "react";
import styles from "./Volunteer.module.css";
import Link from "next/link";

const Volunteer = ({ volunteer }) => {
  return (
    <div className={styles.volunteer}>
      <div className={styles.imageContainer}>
        {volunteer.photo ? (
          <img
            src={volunteer.photo}
            alt={volunteer.name}
            className={styles.volunteerImage}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>No Photo</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{volunteer.name}</h3>
        <p className={styles.address}>{volunteer.address}</p>
        <p className={styles.services}>
          Services:{" "}
          {volunteer.services?.length
            ? volunteer.services.join(", ")
            : "Not specified"}
        </p>
        <p className={styles.availability}>
          Availability: {volunteer.availability || "Not specified"}
        </p>
        <Link
          href={`/volunteers/${volunteer.id}`}
          className={styles.detailsButton}
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default Volunteer;
