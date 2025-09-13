"use client";

import styles from "./BlogPost.module.css";
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import BlogCard from "@/components/BlogCard/BlogCard";
import Link from "next/link";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [allBlogsData, setAllBlogsData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Function to fetch data from the API
  async function fetchBlogCards(searchText = "") {
    try {
      if (searchText) {
        searchText = `?search=${searchText}`;
      }

      // include pagination params
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (searchText) params.append("search", searchText);

      const response = await fetch(api(`/blogposts?${params.toString()}`));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blogsData = await response.json();
      const list = blogsData.data || [];
      setAllBlogsData(list);
      // pagination from API shape
      const apiTotalPages =
        blogsData.pagination?.totalPages ??
        Math.ceil((blogsData.pagination?.totalItems ?? list.length) / limit);
      const apiTotalItems = blogsData.pagination?.totalItems ?? list.length;
      setTotalPages(Number.isFinite(Number(apiTotalPages)) ? Number(apiTotalPages) : 1);
      setTotalItems(Number.isFinite(Number(apiTotalItems)) ? Number(apiTotalItems) : list.length);
    } catch (error) {
      console.error("Error fetching attraction cards:", error);
    }
  }

  useEffect(() => {
    fetchBlogCards(search);
  }, [page, limit]);

  useEffect(() => {
    // Filter and sort logic
    setPage(1);
    fetchBlogCards(search);
  }, [search]);

  return (
    <div className={styles.pageWrapper}>
      <Link className={styles.backButton} href="/" aria-label="Back to home">
        ← Back
      </Link>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>All Blogs</h1>
      </div>
      <div className={styles.searchAndSortWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search Blogs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={styles.filterSelect}>
          <option value="">All Blogs</option>
        </select>
        <select className={styles.filterSelect} defaultValue="">
          <option value="">Sort by City</option>
          <option value="price_asc">Cairo</option>
          <option value="price_desc">Toronto</option>
          <option value="rating_asc">New York</option>
        </select>
      </div>
      <div className={styles.gridContainer}>
        {allBlogsData.map((card) => (
          <BlogCard key={card.id} card={card} />
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
  );
}
