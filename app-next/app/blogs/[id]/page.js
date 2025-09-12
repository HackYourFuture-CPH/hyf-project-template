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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [imageSrc, setImageSrc] = useState(null);

  // Function to fetch data from the API
  async function fetchSingleBlog() {
    try {
      const response = await fetch(`${API_URL}/api/blogposts/${id}`);
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

  // Resolve image source similarly to Card/BlogCard: handle placehold.co, backend-relative paths
  useEffect(() => {
    if (!blog) return;

    const raw = blog.cover_image_url || blog.image_url || "";
    const placeholder = blog?.id
      ? `https://picsum.photos/seed/blog-${blog.id}/1200/800`
      : "/images/blogs/default.jpg";

    const normalize = (s) => {
      if (!s || typeof s !== "string" || s.trim() === "") return null;
      const t = s.trim();
      if (t.includes("placehold.co")) {
        const seed = blog?.id ? `blog-${blog.id}` : encodeURIComponent(t);
        return `https://picsum.photos/seed/${seed}/1200/800`;
      }
      if (t.startsWith("/images/")) return null; // backend path — handle via HEAD
      return t;
    };

    const norm = normalize(raw);
    if (norm) {
      setImageSrc(norm);
      return;
    }

    // Backend-relative: start with placeholder then attempt HEAD
    setImageSrc(placeholder);
    if (raw && raw.startsWith("/images/")) {
      let cancelled = false;
      (async () => {
        try {
          const url = `${API_URL}${raw}`;
          const res = await fetch(url, { method: "HEAD" });
          if (!cancelled && res.ok) setImageSrc(url);
        } catch (e) {
          // keep placeholder
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [blog]);

  if (!blog) return <p>Loading...</p>;

  // Prepare display values
  const rawTitle = blog.title ?? blog.name ?? "Untitled";
  const title = rawTitle.replace(/:\s*[0-9a-f]{6,32}$/i, "").trim();

  const author = blog.author_name ?? blog.author ?? blog.user ?? blog.created_by ?? null;
  const createdAt = blog.created_at ? new Date(blog.created_at) : null;
  const formattedDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const rawCategory = blog.category ?? blog.type ?? null;
  const category = rawCategory
    ? String(rawCategory).toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())
    : null;

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
              src={imageSrc || blog.cover_image_url || "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{title}</h4>
            <div className={styles.postMeta}>
              <PostMeta authorName={author} date={formattedDate} category={category} />
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
