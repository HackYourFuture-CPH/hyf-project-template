"use client";

import styles from "./Trip.module.css";
import Card from "../../components/Card/Card";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  const skipNextFetchRef = useRef(false);

  async function fetchTours() {
    // backward compatibility: no-op placeholder when using the new fetch wrapper
    return;
  }

  // New fetch wrapper that accepts overrides so handlers (Clear etc.) can request
  // a single immediate fetch without relying on batched state updates.
  async function fetchToursWithOptions({
    searchText = undefined,
    sortKeyOverride = undefined,
    filterDestinationOverride = undefined,
    pageOverride = undefined,
    suppressLoading = false,
  } = {}) {
    if (!suppressLoading) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      const currentSort = sortKeyOverride !== undefined ? sortKeyOverride : sortKey;
      const currentFilterDestination =
        filterDestinationOverride !== undefined ? filterDestinationOverride : filterDestination;
      const currentPage = pageOverride !== undefined ? pageOverride : page;

      if (currentSort === "price_asc") params.append("sort", "price_minor-asc");
      else if (currentSort === "price_desc") params.append("sort", "price_minor-desc");
      else if (currentSort === "rating_asc") params.append("sort", "rating-asc");
      else if (currentSort === "rating_desc") params.append("sort", "rating-desc");

      // NOTE: search is handled client-side only for this page (no server-side search)
      // if (searchText) params.append("search", searchText);

      if (currentFilterDestination) params.append("destination", currentFilterDestination);

      params.append("page", String(currentPage));
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
      if (!suppressLoading) setLoading(false);
    }
  }

  // Mirror attractions: explicit effects for each change to avoid relying on a large dep array
  useEffect(() => {
    fetchToursWithOptions();
  }, []);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    setPage(1);
    fetchToursWithOptions({ searchText: search, pageOverride: 1, suppressLoading: true });
  }, [search]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    setPage(1);
    fetchToursWithOptions({ sortKeyOverride: sortKey, pageOverride: 1, suppressLoading: true });
  }, [sortKey]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    setPage(1);
    fetchToursWithOptions({ filterDestinationOverride: filterDestination, pageOverride: 1, suppressLoading: true });
  }, [filterDestination]);

  useEffect(() => {
    fetchToursWithOptions({ pageOverride: page });
  }, [page, limit]);

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

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className={styles.filterButton}
            onClick={() => {
              // avoid the per-effect fetches from firing once we've manually fetched
              skipNextFetchRef.current = true;
              setSearch("");
              setFilterDestination("");
              setSortKey("");
              setPage(1);
              // perform a single immediate fetch and keep UI steady (no global loading flash)
              fetchToursWithOptions({ sortKeyOverride: "", filterDestinationOverride: "", pageOverride: 1, suppressLoading: true });
            }}
            aria-label="Clear filters"
          >
            Clear
          </button>
        </div>

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
            <Card
              key={card.id}
              card={card}
              onFavoriteChange={() => {}}
              viewLink={`/tours/${card.id}`}
            />
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
