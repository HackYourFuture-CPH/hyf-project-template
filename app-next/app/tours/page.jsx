"use client";

import styles from "./Trip.module.css";
import Card from "../../components/Card/Card";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function TripPage() {
  const [search, setSearch] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [error, setError] = useState(null);

  async function fetchTours() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      // backend expects sort like "field-dir"
      if (sortKey === "price_asc") params.append("sort", "price_minor-asc");
      else if (sortKey === "price_desc") params.append("sort", "price_minor-desc");
      else if (sortKey === "rating_asc") params.append("sort", "rating-asc");
      else if (sortKey === "rating_desc") params.append("sort", "rating-desc");

      // NOTE: search is handled client-side only for this page (no server-side search)
      // if (search) params.append("search", search);

      if (filterDestination) params.append("destination", filterDestination);

      params.append("page", String(page));
      params.append("limit", String(limit));

      const url = `${API_URL}/api/tours?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // normalize response
      let list = [];
      if (Array.isArray(data.tours)) list = data.tours;
      else if (Array.isArray(data.travel_plans)) list = data.travel_plans;
      else if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.tours?.items)) list = data.tours.items;

      // pagination info from API
      const apiTotalPages =
        data.totalPages ??
        data.pagination?.totalPages ??
        Math.ceil((data.totalItems ?? data.pagination?.totalItems ?? list.length) / limit);
      const apiTotalItems = data.totalItems ?? data.pagination?.totalItems ?? list.length;
      setTotalPages(Number.isFinite(Number(apiTotalPages)) ? Number(apiTotalPages) : 1);
      setTotalItems(Number.isFinite(Number(apiTotalItems)) ? Number(apiTotalItems) : list.length);

      setTours(list);

      if (Array.isArray(data.tour_destinations)) {
        const uniqueDest = [
          ...new Set(data.tour_destinations.map((d) => `${d.city_name}, ${d.country_name}`)),
        ];
        setDestinations(uniqueDest);
      } else {
        const derived = [
          ...new Set(
            list.flatMap((t) => {
              if (Array.isArray(t.tour_destinations))
                return t.tour_destinations.map((d) => `${d.city_name}, ${d.country_name}`);
              if (t.destination) return [t.destination];
              return [];
            })
          ),
        ].filter(Boolean);
        if (derived.length) setDestinations(derived);
      }
    } catch (err) {
      console.error("Error fetching tours", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTours();
  }, [sortKey, page, limit, filterDestination]);

  // client-side filtering (extra safety)
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      !search ||
      tour.name?.toLowerCase().includes(search.toLowerCase()) ||
      (tour.description || tour.destination || "").toLowerCase().includes(search.toLowerCase());
    const matchesDestination =
      !filterDestination ||
      (Array.isArray(tour.tour_destinations) &&
        tour.tour_destinations.some(
          (d) => `${d.city_name}, ${d.country_name}` === filterDestination
        )) ||
      tour.destination === filterDestination;
    return matchesSearch && matchesDestination;
  });

  return (
    <div className={styles.pageWrapper}>
      <Link className={styles.backButton} href="/" aria-label="Back to home">
        ← Back
      </Link>

      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>All Tours</h1>
      </div>

      <div className={styles.searchAndSortWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search Tours"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={filterDestination}
          onChange={(e) => {
            setFilterDestination(e.target.value);
            setPage(1); // reset page when destination filter changes
          }}
        >
          <option value="">All Destinations</option>
          {destinations.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={sortKey}
          onChange={(e) => {
            setSortKey(e.target.value);
            setPage(1); // reset page when sort changes
          }}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>

      <div className={styles.gridContainer}>
        {loading ? (
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          filteredTours.map((card) => (
            <Card key={card.id} card={card} onFavoriteChange={() => {}} viewLink={`/tours/${card.id}`} />
          ))
        )}
      </div>
      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || page <= 1}
          aria-label="Previous page"
        >
          Prev
        </button>

        <div>
          Page {page} of {totalPages} {totalItems ? `(${totalItems} items)` : ""}
        </div>

        <button
          className={styles.paginationBtn}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={loading || page >= totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
