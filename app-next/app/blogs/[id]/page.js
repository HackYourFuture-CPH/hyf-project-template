"use client";
import styles from "./blogDetails.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostMeta from "@/components/PostMeta/PostMeta";
import Comment from "@/components/CommentSection/Comment";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AttractionDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  // Function to fetch data from the API
  async function fetchSingleBlog() {
    try {
      const response = await fetch(` http://localhost:3001/api/blogposts/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blogData = await response.json();
      setBlog(blogData.data || []);
    } catch (error) {
      console.error("Error fetching blog cards:", error);
    }
  }

  useEffect(() => {
    fetchSingleBlog();
  }, []);

  if (!blog) return <p>Loading...</p>;

  return (
    <>
      <div className={`container ${styles.contentBox}`}>
        <Link className={styles.backButton} href="/" aria-label="Back to home">
          ← Back
        </Link>
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.travelCard}>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"
              alt={blog.title}
              fill
              style={{ objectFit: "cover" }}
              className={styles.image}
            />
          </div>
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{blog.title}</h4>
            <div className={styles.postMeta}>
              <PostMeta />
            </div>
            <div className={styles.meta}>
              <span>{blog.location}</span>
            </div>
            <div className={styles.description}>{blog.content}</div>
          </div>
          <Comment />
        </div>
      </div>
    </>
  );
}
