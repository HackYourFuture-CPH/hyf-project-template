"use client"
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import styles from "./attractions.module.css";
import data from "../../mockData/BlogpostsData.json";
import { useState } from "react";

export default function AttractionsPage() {
   const [search, setSearch] = useState("");
     const [filterDestination, setFilterDestination] = useState("");

  return (
    <div className={styles.pageWrapper}>
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
        <select
          className={styles.filterSelect}
          // value=""
          //onChange={(e) => setFilterDestination(e.target.value)}
        >
          <option value="">All Attractions</option>
          {/* {destinations.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))} */}
        </select>
        <select
          className={styles.filterSelect}
          value=""
          //onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Sort by City</option>
          <option value="price_asc">Cairo</option>
          <option value="price_desc">Toronto</option>
          <option value="rating_asc">New York</option>
      
        </select>
      </div>
      <div className={styles.gridContainer}>
        {/* {loading ? (
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          data.map((card) => <AttractionCard key={card.id} card={card} />)
        )} */}
        {data.map((card) => (
          <AttractionCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
