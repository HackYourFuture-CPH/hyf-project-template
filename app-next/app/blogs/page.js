"use client"

import styles from "./BlogPost.module.css";
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import BlogCard from "@/components/BlogCard/BlogCard";

export default function BlogsPage() {
   const [search, setSearch] = useState("");
    
      const [allBlogsData, setAllBlogsData] = useState([]);
     
       // Function to fetch data from the API
       async function fetchBlogCards(searchText = "") {
         try {
          if(searchText){
            searchText = `?search=${searchText}`;
          }

           const response = await fetch( api("/blogposts"+searchText));
           if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           const blogsData = await response.json();
           setAllBlogsData(blogsData.data || []);
         } catch (error) {
           console.error("Error fetching attraction cards:", error);
         }
       }
     
       useEffect(() => {
         fetchBlogCards();
       }, []);

       useEffect(() => {
        // Filter and sort logic
         fetchBlogCards(search);
       }, [search]);

  return (
    <div className={styles.pageWrapper}>
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
          // value=""
          //onChange={(e) => setFilterDestination(e.target.value)}
        >
          <option value="">All Blogs</option>
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
        {allBlogsData.map((card) => (
          <BlogCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
