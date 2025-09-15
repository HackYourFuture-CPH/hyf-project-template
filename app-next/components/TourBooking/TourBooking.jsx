"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./TourBooking.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function TourBooking({ tourId, capacity: capacityProp, priceMinor: priceMinorProp }) {
  const [num, setNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tourLoading, setTourLoading] = useState(false);
  const [tour, setTour] = useState(null);

  // Determine capacity and price from props or fetched tour
  const capacity = capacityProp ?? (tour ? tour.capacity : undefined);
  const priceMinor = priceMinorProp ?? (tour ? tour.price_minor : null);

  const max = Number.isFinite(Number(capacity)) ? Number(capacity) : undefined;

  const pricePerPerson = Number.isFinite(Number(priceMinor)) ? Number(priceMinor) / 100 : null;

  useEffect(() => {
    // If price or capacity not provided as props, fetch tour details
    if ((!priceMinorProp || !capacityProp) && tourId) {
      setTourLoading(true);
      fetch(`${API_URL}/api/tours/${tourId}`)
        .then((r) => r.json())
        .then((data) => {
          // API returns the tour object at top-level
          if (data && data.id) setTour(data);
        })
        .catch((err) => {
          console.error("Failed to fetch tour details:", err);
        })
        .finally(() => setTourLoading(false));
    }
  }, [tourId, priceMinorProp, capacityProp]);

  function clamp(v) {
    const n = Number(v) || 0;
    if (max !== undefined) return Math.max(1, Math.min(max, Math.floor(n)));
    return Math.max(1, Math.floor(n));
  }

  const uuidRegex = useMemo(
    () => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    []
  );

  async function submitBooking(e) {
    e?.preventDefault?.();
    setError("");
    setSuccess("");

    const next = clamp(num || 1);
    setNum(next);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to book this tour.");
      return;
    }

    if (!tourId || !uuidRegex.test(String(tourId))) {
      setError("Invalid tour identifier.");
      return;
    }

    // If price is not known, warn the user (server will still validate)
    if (pricePerPerson === null) {
      // Let user proceed but inform them
      console.warn("Submitting booking without known price; server will calculate total.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/tour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tour_id: String(tourId), num_travelers: Math.max(1, Math.floor(Number(next))) }),
      });

      if (res.status === 201) {
        const data = await res.json().catch(() => null);
        setSuccess((data && data.message) || "Tour successfully booked!");
        // notify other UI pieces
        try {
          if (typeof window !== "undefined")
            window.dispatchEvent(new CustomEvent("bookingsChanged", { detail: { tourId } }));
        } catch (err) {
          console.error(err);
        }
      } else if (res.status === 409) {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Not enough capacity for this tour.");
      } else if (res.status === 401 || res.status === 403) {
        setError("Authentication required. Please sign in.");
      } else if (res.status === 404) {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Tour not found.");
      } else {
        const text = await res.text().catch(() => "");
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {}
        console.error("Booking failed response:", res.status, text);
        setError(json?.error || json?.message || `Booking failed (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error("Booking request error:", err);
      setError(err?.message || String(err) || "Failed to book tour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitBooking} className={styles.bookingForm} aria-label="Book tour form">
      <label className={styles.field} htmlFor={`people-${tourId}`}>
        <span style={{ fontSize: 14 }}>People</span>
        <input
          id={`people-${tourId}`}
          className={styles.peopleInput}
          type="number"
          min={1}
          max={max}
          value={num}
          onChange={(e) => setNum(clamp(e.target.value))}
          aria-label="Number of people"
        />
      </label>

      {tourLoading ? (
        <div className={styles.msg}>Loading tour info…</div>
      ) : pricePerPerson !== null ? (
        <div className={styles.priceTotal}>{`Total: $${((pricePerPerson || 0) * num).toFixed(2)}`}</div>
      ) : null}

      <button className={styles.btn} type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Booking…" : "Book Now"}
      </button>

      {error ? (
        <div className={`${styles.msg} ${styles.error}`} role="alert">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className={`${styles.msg} ${styles.success}`} role="status">
          {success}
        </div>
      ) : null}
    </form>
  );
}
