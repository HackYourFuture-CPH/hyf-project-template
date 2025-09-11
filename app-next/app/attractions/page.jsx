"use client";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import styles from "./attractions.module.css";
import { use, useEffect, useState } from "react";
import api from "../../utils/api.js";
import Link from "next/link";

export default function AttractionsPage() {
  const [search, setSearch] = useState("");
  const [attractionCardData, setAttractionCardData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // simulate API fetch while there is no DB data

  // Function to fetch data from the API
  async function fetchAttractionCards(searchText = "", location = "") {
    try {
      if (searchText) {
        searchText = `?search=${searchText}`;
      } else if (location) {
        searchText = `?location=${location}`;
      }

      // add pagination params
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (searchText) params.append("search", searchText);
      if (location && !searchText) params.append("location", location);

      const response = await fetch(api(`/attractions?${params.toString()}`));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const attractionData = await response.json();
      const list = attractionData.data || [];
      setAttractionCardData(list);
      const apiTotalPages =
        attractionData.pagination?.totalPages ??
        Math.ceil((attractionData.pagination?.totalItems ?? list.length) / limit);
      const apiTotalItems = attractionData.pagination?.totalItems ?? list.length;
      setTotalPages(Number.isFinite(Number(apiTotalPages)) ? Number(apiTotalPages) : 1);
      setTotalItems(Number.isFinite(Number(apiTotalItems)) ? Number(apiTotalItems) : list.length);
    } catch (error) {
      console.error("Error fetching attraction cards:", error);
    }
  }

  async function fetchLocations() {
    try {
      const response = await fetch(api("/attractions/locations"));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const locationsData = await response.json();
      setLocations(locationsData.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }

  useEffect(() => {
    fetchAttractionCards();
    fetchLocations();
  }, []);

  useEffect(() => {
    // Filter and sort logic
    setPage(1);
    fetchAttractionCards(search, "");
  }, [search]);

  useEffect(() => {
    if (sortKey) {
      setPage(1);
      fetchAttractionCards("", sortKey);
    }
  }, [sortKey]);

  useEffect(() => {
    fetchAttractionCards();
  }, [filterDestination]);

  useEffect(() => {
    // refetch when page or limit changes
    fetchAttractionCards(search, filterDestination);
  }, [page, limit]);

  return (
    <>
      <div className={styles.pageWrapper}>
        <Link className={styles.backButton} href="/" aria-label="Back to home">
          ← Back
        </Link>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>All Attractions</h1>
        </div>
        <div className={styles.searchAndSortWrapper}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Attractions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={styles.filterButton}
            onClick={() => {
              setSearch(""); // clear search field
              setSortKey(""); // reset sort if you want
              setFilterDestination(""); // reset filter if needed
              fetchAttractionCards(); // reload default data
            }}
          >
            Clear
          </button>

          <select
            className={styles.filterSelect}
            value=""
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="">Filter by City</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.gridContainer}>
          {attractionCardData.map((card) => (
            <AttractionCard key={card.id} card={card} />
          ))}
        </div>
        {/* Pagination controls */}
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
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
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
