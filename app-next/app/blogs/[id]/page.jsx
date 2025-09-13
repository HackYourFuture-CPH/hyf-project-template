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
  const [derivedAuthor, setDerivedAuthor] = useState(null);
  const [derivedAvatar, setDerivedAvatar] = useState(null);
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
  // API may return { data: {...} } or the blog object directly — prefer the object
  const resolved = blogData.data || blogData || null;
  // Helpful debug: show the fetched blog shape in browser console when developing
  setBlog(resolved);
    } catch (error) {
      console.error("Error fetching blog cards:", error);
    }
  }

  useEffect(() => {
    fetchSingleBlog();
  }, []);

  // If the blog doesn't include author info, try to derive it from the
  // currently-authenticated user's profile (useful when posts just created client-side)
  useEffect(() => {
    if (!blog) return;
    // Reset derived values
    setDerivedAuthor(null);
    setDerivedAvatar(null);

    // Only skip deriving the author if the API provides meaningful author info.
    // Sometimes `blog.user` exists but only contains a numeric id (truthy) which
    // shouldn't prevent us from deriving the author from the authenticated profile.
    const userHasIdentifyingInfo = blog.user && (
      (typeof blog.user === "string" && blog.user.trim() !== "") ||
      (typeof blog.user === "object" && (
        blog.user.full_name || blog.user.first_name || blog.user.last_name || blog.user.username || blog.user.id || blog.user.user_id
      ))
    );

  // Do NOT treat `created_by` (which is often a numeric id) as sufficient to
  // skip derivation — created_by will be used for matching but is not an
  // identifying display name. Only skip if an actual author name/avatar is
  // present (author_name/author) or if `blog.user` contains identifying info.
  const hasAuthor = Boolean(blog.author_name || blog.author || userHasIdentifyingInfo);
    if (hasAuthor) return; // nothing to derive

    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const res = await fetch(`${API_URL}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        const profile = json?.data || json || null;
        if (!profile) return;

        // Match profile to blog author by id or username where possible
        const blogUserId = blog.created_by || blog.user?.id || blog.user?.user_id || blog.user;
        const profileId = profile.id || profile.user_id || profile.userId || null;
        const profileUsername = profile.username || null;

        if (String(blogUserId) === String(profileId) || String(blogUserId) === String(profileUsername)) {
          setDerivedAuthor(profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.username || null);
          setDerivedAvatar(profile.profile_image || profile.avatar || null);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, [blog]);

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

  let author = blog.author_name ?? blog.author ?? blog.created_by ?? null;
  let avatar = blog.author_profile_image ?? blog.profile_image ?? blog.author_image ?? null;
  // If avatar is a backend-relative path (e.g. /images/...), convert to absolute URL
  if (avatar && typeof avatar === "string" && avatar.startsWith("/images/")) {
    const abs = `${API_URL}${avatar}`;
    avatar = abs;
    // Optionally we could HEAD-check but Image component or <img> will failover to placeholder
  }
    if (!author && derivedAuthor) author = derivedAuthor;
      if (!avatar && derivedAvatar) avatar = derivedAvatar;
    // If backend returns username/first_name/last_name fields (common in posts list),
    // use them as a display name when explicit author fields are missing.
    if (!author) {
      const fullname = `${blog.first_name || ""} ${blog.last_name || ""}`.trim();
      const isPlaceholder = (n) => typeof n === "string" && /^\s*(first\d*|last\d*)\s*$/i.test(n);
      const parts = fullname.split(/\s+/).filter(Boolean);
      const isFullPlaceholder = parts.length > 0 && parts.every((p) => isPlaceholder(p));
      if (fullname && !isFullPlaceholder) author = fullname;
      else if (blog.username) author = blog.username;
    }

    // Debugging helpers to make it easier to see what values were used
    // debug logs removed
  if (!author && blog.user) {
    if (typeof blog.user === "string") author = blog.user;
    else if (typeof blog.user === "object") {
      author = blog.user.full_name || `${blog.user.first_name || ""} ${blog.user.last_name || ""}`.trim() || blog.user.username || null;
      avatar = avatar || blog.user.profile_image || blog.user.avatar || null;
    }
  }
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
              <PostMeta authorName={author} avatar={avatar} date={formattedDate} category={category} />
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
