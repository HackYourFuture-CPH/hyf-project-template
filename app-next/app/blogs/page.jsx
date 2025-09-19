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
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  // Function to fetch data from the API
  async function fetchBlogCards(searchText = "") {
    try {
      // include pagination params
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (searchText) params.append("search", searchText);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);

      const url = api(`/blogposts?${params.toString()}`);
      // log the final URL so it's easy to debug what's being requested
      console.log("Fetching blogposts:", url);
      const response = await fetch(url);
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
      console.error("Error fetching blog cards:", error);
    }
  }

  // Load categories from backend so the select options match server-side categories
  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const res = await fetch(api("/blogposts/categories"));
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCategoriesList(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        // ignore silently; categories are optional
        console.warn("Failed to load categories", err);
      }
    }
    loadCategories();
    return () => (mounted = false);
  }, []);

  // When the search term or filters change, reset pagination to the first page.
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  // Fetch whenever page, limit, search or filters change.
  useEffect(() => {
    fetchBlogCards(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, category, sort]);

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
        <select
          className={styles.filterSelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="created_at-desc">Newest</option>
          <option value="created_at-asc">Oldest</option>
          <option value="title-asc">Title A→Z</option>
          <option value="title-desc">Title Z→A</option>
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
