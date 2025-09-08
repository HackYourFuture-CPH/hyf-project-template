"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./User.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export default function UserPage() {
  // local UI state
  const [currentSection, setCurrentSection] = useState("summary");

  // lightweight mock data to render the dashboard (matches the example layout)
  const mockUsers = [
    {
      id: "user1",
      first_name: "John",
      last_name: "Doe",
      role: "user",
      username: "john_doe",
      email: "john@example.com",
    },
    {
      id: "user3",
      first_name: "Admin",
      last_name: "User",
      role: "admin",
      username: "admin_user",
      email: "admin@example.com",
    },
  ];

  const mockTravelPlans = [
    {
      id: "tour1",
      name: "Grand European Tour",
      destination: "Europe",
      start_date: "2025-09-01",
      duration_days: 14,
      price_usd: 2400,
      plan_type: "tour",
      owner_id: null,
    },
    {
      id: "usertrip1",
      name: "John's Hawaiian Getaway",
      destination: "Hawaii",
      start_date: "2026-01-10",
      duration_days: 8,
      price_usd: 3500,
      plan_type: "user",
      owner_id: "user1",
    },
  ];

  const mockUserPosts = [
    { id: "post1", user_id: "user2", title: "Hiking the Cinque Terre", category: "Nature" },
    { id: "post2", user_id: "user1", title: "Culinary Journey in Rome", category: "Food" },
  ];

  const mockFavorites = [
    { userId: "user1", type: "tour", itemId: "tour2" },
    { userId: "user1", type: "post", itemId: "post1" },
  ];

  const mockReviews = [{ id: "review1", tour_id: "tour1", user_id: "user2", rating: 5 }];

  // pretend current user is John for the dashboard
  const currentUser = mockUsers[0];

  function renderSummary() {
    const myTrips = mockTravelPlans.filter((t) => t.owner_id === currentUser.id);
    const upcomingTrips = myTrips.filter((t) => new Date(t.start_date) >= new Date());
    const myPosts = mockUserPosts.filter(
      (p) => p.user_id === currentUser.id || p.user_id === undefined
    );
    const myFavorites = mockFavorites.filter((f) => f.userId === currentUser.id);

    return (
      <div className={styles.profileCard}>
        <h2 className={styles.dashboardTitle}>Welcome, {currentUser.first_name}!</h2>

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
    const myTrips = mockTravelPlans.filter((t) => t.owner_id === currentUser.id);
    const upcoming = myTrips.filter((t) => new Date(t.start_date) >= new Date());
    const past = myTrips.filter((t) => new Date(t.start_date) < new Date());

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
    return (
      <div className={styles.profileCard}>
        <div className={styles.profileRow}>
          <div className={styles.avatarWrap}>
            <Image
              src="/card-images/default.webp"
              alt="avatar"
              width={120}
              height={120}
              className={styles.avatar}
            />
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>
              {currentUser.first_name} {currentUser.last_name}
            </h3>
            <div className={styles.field}>
              <strong>Username:</strong> {currentUser.username}
            </div>
            <div className={styles.field}>
              <strong>Email:</strong> {currentUser.email}
            </div>
          </div>
        </div>
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
                <span>My Trips</span>
              </div>
              <div
                onClick={() => setCurrentSection("posts")}
                className={`${styles.navItem} ${currentSection === "posts" ? styles.active : ""}`}
              >
                <i className={`fas fa-newspaper ${styles.navIcon}`} aria-hidden />
                <span>My Posts</span>
              </div>
              <div
                onClick={() => setCurrentSection("favorites")}
                className={`${styles.navItem} ${currentSection === "favorites" ? styles.active : ""}`}
              >
                <i className={`fas fa-heart ${styles.navIcon}`} aria-hidden />
                <span>My Favorites</span>
              </div>
              <div
                onClick={() => setCurrentSection("reviews")}
                className={`${styles.navItem} ${currentSection === "reviews" ? styles.active : ""}`}
              >
                <i className={`fas fa-star ${styles.navIcon}`} aria-hidden />
                <span>My Reviews</span>
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
            {currentSection === "posts" && (
              <div className={styles.profileCard}>
                <h3>My Posts</h3>
                <p className={styles.empty}>No posts to show.</p>
              </div>
            )}
            {currentSection === "favorites" && (
              <div className={styles.profileCard}>
                <h3>My Favorites</h3>
                <p className={styles.empty}>No favorites yet.</p>
              </div>
            )}
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
