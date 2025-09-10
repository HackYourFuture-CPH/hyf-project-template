"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./User.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export default function UserPage() {
  // local UI state
  const [currentSection, setCurrentSection] = useState("summary");

  // fetched data
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handler to update favorites when a Card toggles favorite
  function handleFavoriteChange({ added, itemId }) {
    setFavorites((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      if (added) {
        if (!arr.find((f) => (f.itemId || f.item_id) === itemId)) {
          arr.push({ itemId, item_type: "tour" });
        }
      } else {
        const filtered = arr.filter((f) => (f.itemId || f.item_id) !== itemId);
        try {
          localStorage.setItem("favorites", JSON.stringify(filtered));
        } catch {}
        return filtered;
      }
      try {
        localStorage.setItem("favorites", JSON.stringify(arr));
      } catch {}
      return arr;
    });
  }

  // helper to safely parse JSON or return text
  async function safeParseResponse(res) {
    const text = await res.text();
    try {
      return { body: JSON.parse(text), raw: text };
    } catch {
      return { body: null, raw: text };
    }
  }

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // 1) Profile
        try {
          const resProfile = await fetch(`${API_URL}/api/users/profile`, { headers });
          const parsed = await safeParseResponse(resProfile);
          if (resProfile.ok && parsed.body) {
            setUser(parsed.body.data || parsed.body);
          } else {
            console.debug("Profile fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Profile request error:", err.message);
        }

        // 2) Posts (fetch all, filter client-side by user later)
        try {
          const resPosts = await fetch(`${API_URL}/api/posts`, { headers });
          const parsed = await safeParseResponse(resPosts);
          if (resPosts.ok && parsed.body) {
            setPosts(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Posts fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Posts request error:", err.message);
        }

        // 3) Tours (request larger page to include more items)
        try {
          const resTours = await fetch(`${API_URL}/api/tours?limit=100`, { headers });
          const parsed = await safeParseResponse(resTours);
          if (resTours.ok && parsed.body) {
            // backend returns { tours: [...] } or { data: [...] }
            setTours(parsed.body.tours || parsed.body.data || parsed.body || []);
          } else {
            console.debug("Tours fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Tours request error:", err.message);
        }

        // 4) Favorites - try server, fallback to localStorage
        try {
          const resFav = await fetch(`${API_URL}/api/favorites`, { headers });
          if (resFav.ok) {
            const parsed = await safeParseResponse(resFav);
            const favs = parsed.body?.data || parsed.body || [];
            if (mounted) {
              setFavorites(favs);
              try {
                localStorage.setItem("favorites", JSON.stringify(favs));
              } catch {}
            }
          } else {
            // fallback to localStorage
            const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (mounted) setFavorites(saved);
          }
        } catch (err) {
          console.debug("Favorites request error (may be unsupported):", err.message);
          const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
          if (mounted) setFavorites(saved);
        }

        // 5) Reviews - backend exposes tour reviews under /api/tours/:id/reviews; no user-wide endpoint
        // We'll skip fetching reviews globally and show counts derived from posts/tours if needed.
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // listen for global favorite events from Card components
  useEffect(() => {
    function onFav(e) {
      const { added, itemId } = e.detail || {};
      if (itemId) handleFavoriteChange({ added, itemId });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesChanged", onFav);
    }
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("favoritesChanged", onFav);
    };
  }, []);

  function renderSummary() {
    if (!user) {
      return (
        <div className={styles.profileCard}>
          <h2 className={styles.dashboardTitle}>Welcome!</h2>
          <p className={styles.empty}>Please log in to see your dashboard summary.</p>
        </div>
      );
    }

    const myTrips = tours.filter(
      (t) => t.owner_id === user.id || t.owner_id === user.sub || t.owner_id === user.user_id
    );
    const upcomingTrips = myTrips.filter(
      (t) => t.start_date && new Date(t.start_date) >= new Date()
    );
    const myPosts = posts.filter((p) => p.user_id === user.id || p.user_id === user.user_id);
    const myFavorites = favorites.filter(
      (f) => f.user_id === user.id || f.user_id === user.user_id || f.userId === user.id
    );

    return (
      <div className={styles.profileCard}>
        <h2 className={styles.dashboardTitle}>
          Welcome, {user.full_name || user.first_name || user.username}!
        </h2>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✈️</div>
            <div>
              <div className={styles.statNumber}>{upcomingTrips.length}</div>
              <div className={styles.statLabel}>Upcoming Trips</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📰</div>
            <div>
              <div className={styles.statNumber}>{myPosts.length}</div>
              <div className={styles.statLabel}>Total Posts</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div>
              <div className={styles.statNumber}>{myFavorites.length}</div>
              <div className={styles.statLabel}>Favorites</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderTrips() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view trips.</p>
        </div>
      );

    const myTrips = tours.filter(
      (t) => t.owner_id === user.id || t.owner_id === user.sub || t.owner_id === user.user_id
    );
    const upcoming = myTrips.filter((t) => t.start_date && new Date(t.start_date) >= new Date());
    const past = myTrips.filter((t) => t.start_date && new Date(t.start_date) < new Date());

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>My Trips</h3>
          <button className={styles.addButton}>+ Add New Trip</button>
        </div>
        <div className={styles.subSection}>
          <h4>Upcoming Trips</h4>
          <div className={styles.cardGrid}>
            {upcoming.length === 0 ? (
              <p className={styles.empty}>No upcoming trips.</p>
            ) : (
              upcoming.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardTitle}>{t.name}</div>
                  <div className={styles.cardMeta}>
                    {t.duration_days} days • {t.destination}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.subSection}>
          <h4>Past Trips</h4>
          <div className={styles.cardGrid}>
            {past.length === 0 ? (
              <p className={styles.empty}>No past trips.</p>
            ) : (
              past.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardTitle}>{t.name}</div>
                  <div className={styles.cardMeta}>
                    {t.duration_days} days • {t.destination}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderProfile() {
    if (loading) return <div className={styles.profileCard}>Loading profile…</div>;
    if (error) return <div className={styles.profileCard}>Error loading profile: {error}</div>;
    if (!user) {
      return (
        <div className={styles.profileCard}>
          <div className={styles.profileRow}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>?</div>
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>Guest</h3>
              <div className={styles.field}>Not signed in</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.profileCard}>
        <div className={styles.profileRow}>
          <div className={styles.avatarWrap}>
            {user.profile_image ? (
              <Image
                src={user.profile_image}
                alt="avatar"
                width={120}
                height={120}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatar}>
                {(user.full_name || user.first_name || user.username || "")[0]}
              </div>
            )}
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>
              {user.full_name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                user.username}
            </h3>
            <div className={styles.field}>
              <strong>Username:</strong> {user.username || "—"}
            </div>
            <div className={styles.field}>
              <strong>Email:</strong> {user.email || "—"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderPosts() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Sign in to see your posts.</p>
        </div>
      );
    const myPosts = posts.filter((p) => p.user_id === user.id || p.user_id === user.user_id);
    return (
      <div className={styles.profileCard}>
        <h3>My Posts</h3>
        {myPosts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
        {myPosts.map((p) => (
          <div key={p.id} className={styles.postRow}>
            <div>{p.title}</div>
            <div className={styles.postMeta}>{p.category || p.tags?.join(", ") || "General"}</div>
          </div>
        ))}
      </div>
    );
  }

  function renderFavorites() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Sign in to see favorites.</p>
        </div>
      );
    const myFavorites = favorites.filter(
      (f) => f.user_id === user.id || f.userId === user.id || f.owner_id === user.id
    );
    return (
      <div className={styles.profileCard}>
        <h3>Favorites</h3>
        {myFavorites.length === 0 && <p className={styles.empty}>No favorites yet.</p>}
        {myFavorites.map((f, i) => (
          <div key={i} className={styles.postRow}>
            <div>{f.item_type || f.type || "item"}</div>
            <div className={styles.postMeta}>{f.item_id || f.itemId || f.id}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Home
      </Link>

      <div className={styles.dashboard}>
        <aside className={styles.aside}>
          <div className={styles.sidebarCard}>
            <h2 className={styles.dashboardTitle}>My Dashboard</h2>
            <nav className={styles.dashboardNav}>
              <div
                onClick={() => setCurrentSection("summary")}
                className={`${styles.navItem} ${currentSection === "summary" ? styles.active : ""}`}
              >
                <i className={`fas fa-home ${styles.navIcon}`} aria-hidden />
                <span>Summary</span>
              </div>
              <div
                onClick={() => setCurrentSection("trips")}
                className={`${styles.navItem} ${currentSection === "trips" ? styles.active : ""}`}
              >
                <i className={`fas fa-plane-departure ${styles.navIcon}`} aria-hidden />
                <span>Trips</span>
              </div>
              <div
                onClick={() => setCurrentSection("posts")}
                className={`${styles.navItem} ${currentSection === "posts" ? styles.active : ""}`}
              >
                <i className={`fas fa-newspaper ${styles.navIcon}`} aria-hidden />
                <span>Posts</span>
              </div>
              <div
                onClick={() => setCurrentSection("favorites")}
                className={`${styles.navItem} ${currentSection === "favorites" ? styles.active : ""}`}
              >
                <i className={`fas fa-heart ${styles.navIcon}`} aria-hidden />
                <span>Favorites</span>
              </div>
              <div
                onClick={() => setCurrentSection("reviews")}
                className={`${styles.navItem} ${currentSection === "reviews" ? styles.active : ""}`}
              >
                <i className={`fas fa-star ${styles.navIcon}`} aria-hidden />
                <span>Reviews</span>
              </div>
              <div
                onClick={() => setCurrentSection("ai-history")}
                className={`${styles.navItem} ${currentSection === "ai-history" ? styles.active : ""}`}
              >
                <i className={`fas fa-magic ${styles.navIcon}`} aria-hidden />
                <span>AI Trip History</span>
              </div>
              <div
                onClick={() => setCurrentSection("profile")}
                className={`${styles.navItem} ${currentSection === "profile" ? styles.active : ""}`}
              >
                <i className={`fas fa-user-edit ${styles.navIcon}`} aria-hidden />
                <span>My Profile</span>
              </div>
            </nav>
          </div>
        </aside>

        <main className={styles.main}>
          <div id="dashboard-content-area" className={styles.dashboardContent}>
            {currentSection === "summary" && renderSummary()}
            {currentSection === "trips" && renderTrips()}
            {currentSection === "profile" && renderProfile()}
            {currentSection === "posts" && renderPosts()}
            {currentSection === "favorites" && renderFavorites()}
            {currentSection === "reviews" && (
              <div className={styles.profileCard}>
                <h3>My Reviews</h3>
                <p className={styles.empty}>No reviews yet.</p>
              </div>
            )}
            {currentSection === "ai-history" && (
              <div className={styles.profileCard}>
                <h3>AI Trip History</h3>
                <p className={styles.empty}>No AI requests yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </main>
  );
}
