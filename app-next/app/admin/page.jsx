"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Admin.module.css";
import Card from "../../components/Card/Card";
import BlogCard from "../../components/BlogCard/BlogCard";
import SearchBox from "../../components/SearchBox/SearchBox";
import UserSearchResults from "../../components/UserSearchResults/UserSearchResults";
import TourSearchResults from "../../components/TourSearchResults/TourSearchResults";
import PostSearchResults from "../../components/PostSearchResults/PostSearchResults";
import AttractionSearchResults from "../../components/AttractionSearchResults/AttractionSearchResults";
import { useUserSearch } from "../../hooks/useUserSearch";
import { useTourSearch } from "../../hooks/useTourSearch";
import { usePostSearch } from "../../hooks/usePostSearch";
import { useAttractionSearch } from "../../hooks/useAttractionSearch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminPage() {
  // local UI state
  const [currentSection, setCurrentSection] = useState("dashboard");

  // fetched data
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Modal states for CRUD operations
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateAttractionModal, setShowCreateAttractionModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showEditAttractionModal, setShowEditAttractionModal] = useState(false);
  
  // Form states
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "" });
  const [newTour, setNewTour] = useState({ name: "", description: "", price_minor: "", duration_days: "", destination: "" });
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", username: "", mobile: "", role: "user" });
  const [newAttraction, setNewAttraction] = useState({ title: "", content: "", location: "", type: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingAttraction, setEditingAttraction] = useState(null);
  
  // Loading states
  const [creatingPost, setCreatingPost] = useState(false);
  const [creatingTour, setCreatingTour] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingAttraction, setCreatingAttraction] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [updatingTour, setUpdatingTour] = useState(false);
  const [deletingTour, setDeletingTour] = useState(false);
  const [updatingPost, setUpdatingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [updatingAttraction, setUpdatingAttraction] = useState(false);
  const [deletingAttraction, setDeletingAttraction] = useState(false);
  
  // Error states
  const [createError, setCreateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // User search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    clearSearch
  } = useUserSearch();

  // Tour search hook
  const {
    searchTerm: tourSearchTerm,
    setSearchTerm: setTourSearchTerm,
    searchResults: tourSearchResults,
    isSearching: isTourSearching,
    searchError: tourSearchError,
    hasSearched: hasTourSearched,
    clearSearch: clearTourSearch
  } = useTourSearch();

  // Post search hook
  const {
    searchTerm: postSearchTerm,
    setSearchTerm: setPostSearchTerm,
    searchResults: postSearchResults,
    isSearching: isPostSearching,
    searchError: postSearchError,
    hasSearched: hasPostSearched,
    clearSearch: clearPostSearch
  } = usePostSearch();

  // Attraction search hook
  const {
    searchTerm: attractionSearchTerm,
    setSearchTerm: setAttractionSearchTerm,
    searchResults: attractionSearchResults,
    isSearching: isAttractionSearching,
    searchError: attractionSearchError,
    hasSearched: hasAttractionSearched,
    clearSearch: clearAttractionSearch
  } = useAttractionSearch();

  // Post handlers
  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      id: post.id,
      title: post.title || "",
      category: post.category || "",
      content: post.content || "",
    });
    setShowEditPostModal(true);
  };

  const handleDeletePost = async (post) => {
    if (confirm(`Are you sure you want to delete post "${post.title}"?`)) {
      setDeletingPost(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/admin/posts/${post.id}`, {
          method: "DELETE",
          headers,
        });

        if (res.ok) {
          // Remove post from both search results and main posts list
          setPosts((prev) => prev.filter((p) => p.id !== post.id));
          // Also update search results if post is in search results
          if (postSearchResults.some((p) => p.id === post.id)) {
            // Trigger a new search to refresh results
            setPostSearchTerm(postSearchTerm);
          }
        } else {
          const errorData = await res.json();
          alert(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        alert(`Error deleting post: ${err.message}`);
      } finally {
        setDeletingPost(false);
      }
    }
  };

  // Attraction handlers
  const handleEditAttraction = (attraction) => {
    setEditingAttraction(attraction);
    setNewAttraction({
      id: attraction.id,
      title: attraction.title || "",
      content: attraction.content || "",
      location: attraction.location || "",
      type: attraction.type || "",
    });
    setShowEditAttractionModal(true);
  };

  const handleDeleteAttraction = async (attraction) => {
    if (confirm(`Are you sure you want to delete attraction "${attraction.title}"?`)) {
      setDeletingAttraction(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/admin/attractions/${attraction.id}`, {
          method: "DELETE",
          headers,
        });

        if (res.ok) {
          // Remove attraction from both search results and main attractions list
          setAttractions((prev) => prev.filter((a) => a.id !== attraction.id));
          // Also update search results if attraction is in search results
          if (attractionSearchResults.some((a) => a.id === attraction.id)) {
            // Trigger a new search to refresh results
            setAttractionSearchTerm(attractionSearchTerm);
          }
        } else {
          const errorData = await res.json();
          alert(`Failed to delete attraction: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        alert(`Error deleting attraction: ${err.message}`);
      } finally {
        setDeletingAttraction(false);
      }
    }
  };

  function closeCreateModal() {
    setShowCreatePostModal(false);
    setNewPost({ title: "", category: "", content: "" });
    setCreateError("");
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // helper to safely parse JSON or return text
  async function safeParseResponse(res) {
    const text = await res.text();
    try {
      return { body: JSON.parse(text), raw: text };
    } catch {
      return { body: null, raw: text };
    }
  }

  // Fetch admin data when component mounts
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // 1) Admin Profile
        try {
          const resProfile = await fetch(`${API_URL}/api/users/profile`, { headers });
          const parsed = await safeParseResponse(resProfile);
          if (resProfile.ok && parsed.body) {
            if (mounted) setUser(parsed.body.data || parsed.body);
          } else {
            console.debug("Profile fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Profile request error:", err.message);
        }

        // 2) All Posts (admin endpoint)
        try {
          const resPosts = await fetch(`${API_URL}/api/admin/posts`, { headers });
          const parsed = await safeParseResponse(resPosts);
          if (resPosts.ok && parsed.body) {
            if (mounted) setPosts(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Posts fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Posts request error:", err.message);
        }

        // 3) All Tours (admin endpoint)
        try {
          const resTours = await fetch(`${API_URL}/api/admin/tours`, { headers });
          const parsed = await safeParseResponse(resTours);
          if (resTours.ok && parsed.body) {
            if (mounted) setTours(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Tours fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Tours request error:", err.message);
        }

        // 4) All Users (admin endpoint)
        try {
          const resUsers = await fetch(`${API_URL}/api/admin/users`, { headers });
          const parsed = await safeParseResponse(resUsers);
          if (resUsers.ok && parsed.body) {
            if (mounted) setUsers(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Users fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Users request error:", err.message);
        }

        // 5) All Attractions (admin endpoint)
        try {
          const resAttractions = await fetch(`${API_URL}/api/admin/attractions`, { headers });
          const parsed = await safeParseResponse(resAttractions);
          if (resAttractions.ok && parsed.body) {
            if (mounted) setAttractions(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Attractions fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Attractions request error:", err.message);
        }

        // 6) All Reviews (using tour_reviews table)
        try {
          const resReviews = await fetch(`${API_URL}/api/admin/dashboard/stats`, { headers });
          const parsed = await safeParseResponse(resReviews);
          if (resReviews.ok && parsed.body) {
            // We'll use the stats for now, can add dedicated reviews endpoint later
            if (mounted) setReviews([]); // Placeholder for now
          } else {
            console.debug("Reviews fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Reviews request error:", err.message);
        }

      } catch (err) {
        if (mounted) setError(err.message || "Failed to load admin dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  function renderDashboard() {
    if (!user) {
      return (
        <div className={styles.profileCard}>
          <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
          <p className={styles.empty}>Please log in to access admin panel.</p>
        </div>
      );
    }

    const totalUsers = users.length;
    const totalTours = tours.length;
    const totalPosts = posts.length;
    const totalAttractions = attractions.length;
    const totalReviews = reviews.length;

    return (
      <div className={styles.profileCard}>
        <h2 className={styles.dashboardTitle}>
          Welcome, Admin {user.full_name || user.first_name || user.username}!
        </h2>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div>
              <div className={styles.statNumber}>{totalUsers}</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✈️</div>
            <div>
              <div className={styles.statNumber}>{totalTours}</div>
              <div className={styles.statLabel}>Total Tours</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📰</div>
            <div>
              <div className={styles.statNumber}>{totalPosts}</div>
              <div className={styles.statLabel}>Total Posts</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏛️</div>
            <div>
              <div className={styles.statNumber}>{totalAttractions}</div>
              <div className={styles.statLabel}>Attractions</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div>
              <div className={styles.statNumber}>{totalReviews}</div>
              <div className={styles.statLabel}>Reviews</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderUsers() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view users.</p>
        </div>
      );

    const handleEditUser = (user) => {
      setEditingUser(user);
      setNewUser({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        mobile: user.mobile || "",
        role: user.role || "user"
      });
      setShowEditUserModal(true);
    };

    const handleDeleteUser = async (user) => {
      if (confirm(`Are you sure you want to delete user ${user.first_name} ${user.last_name}?`)) {
        setDeletingUser(true);
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;

          const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
            method: "DELETE",
            headers,
          });

          if (res.ok) {
            // Remove user from both search results and main users list
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            // Also update search results if user is in search results
            if (searchResults.some((u) => u.id === user.id)) {
              // Trigger a new search to refresh results
              setSearchTerm(searchTerm);
            }
          } else {
            const errorData = await res.json();
            alert(`Failed to delete user: ${errorData.error || 'Unknown error'}`);
          }
        } catch (err) {
          alert(`Error deleting user: ${err.message}`);
        } finally {
          setDeletingUser(false);
        }
      }
    };

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>User Management</h3>
          <button 
            className={styles.addButton}
            onClick={() => {
              setCreateError("");
              setNewUser({ first_name: "", last_name: "", email: "", username: "", mobile: "", role: "user" });
              setShowCreateUserModal(true);
            }}
          >
            + Add New User
          </button>
        </div>

        {/* Search Box */}
        <SearchBox
          placeholder="Search users (name, email, username)..."
          onSearch={setSearchTerm}
          onClear={clearSearch}
          isLoading={isSearching}
        />

        {/* Search Results */}
        <UserSearchResults
          users={searchResults}
          isLoading={isSearching}
          error={searchError}
          hasSearched={hasSearched}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        {/* All Users List (when not searching) */}
        {!hasSearched && (
          <div className={styles.cardGrid}>
            {users.length === 0 ? (
              <p className={styles.empty}>No users found.</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className={styles.card}>
                  <div className={styles.cardTitle}>{u.full_name || u.username}</div>
                  <div className={styles.cardMeta}>
                    {u.email} • {u.role || 'user'}
                  </div>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.secondary}
                      onClick={() => handleEditUser(u)}
                      disabled={deletingUser}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.secondary}
                      onClick={() => handleDeleteUser(u)}
                      disabled={deletingUser}
                    >
                      {deletingUser ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  function renderTours() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view tours.</p>
        </div>
      );

    const handleEditTour = (tour) => {
      setEditingTour(tour);
      setNewTour({
        name: tour.name || "",
        description: tour.description || "",
        price_minor: tour.price_minor || "",
        duration_days: tour.duration_days || "",
        destination: tour.destination || ""
      });
      setShowEditTourModal(true);
    };

    const handleDeleteTour = async (tour) => {
      if (confirm(`Are you sure you want to delete tour "${tour.name}"?`)) {
        setDeletingTour(true);
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;

          const res = await fetch(`${API_URL}/api/admin/tours/${tour.id}`, {
            method: "DELETE",
            headers,
          });

          if (res.ok) {
            // Remove tour from both search results and main tours list
            setTours((prev) => prev.filter((t) => t.id !== tour.id));
            // Also update search results if tour is in search results
            if (tourSearchResults.some((t) => t.id === tour.id)) {
              // Trigger a new search to refresh results
              setTourSearchTerm(tourSearchTerm);
            }
          } else {
            const errorData = await res.json();
            alert(`Failed to delete tour: ${errorData.error || 'Unknown error'}`);
          }
        } catch (err) {
          alert(`Error deleting tour: ${err.message}`);
        } finally {
          setDeletingTour(false);
        }
      }
    };

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Tour Management</h3>
          <button 
            className={styles.addButton}
            onClick={() => {
              setCreateError("");
              setNewTour({ name: "", description: "", price_minor: "", duration_days: "", destination: "" });
              setShowCreateTourModal(true);
            }}
          >
            + Add New Tour
          </button>
        </div>

        {/* Search Box */}
        <SearchBox
          placeholder="Search tours (name, description)..."
          onSearch={setTourSearchTerm}
          onClear={clearTourSearch}
          isLoading={isTourSearching}
        />

        {/* Search Results */}
        <TourSearchResults
          tours={tourSearchResults}
          isLoading={isTourSearching}
          error={tourSearchError}
          hasSearched={hasTourSearched}
          onEdit={handleEditTour}
          onDelete={handleDeleteTour}
        />

        {/* All Tours List (when not searching) */}
        {!hasTourSearched && (
          <div className={styles.cardGrid}>
            {tours.length === 0 ? (
              <p className={styles.empty}>No tours found.</p>
            ) : (
              tours.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardTitle}>{t.name}</div>
                  <div className={styles.cardMeta}>
                    {t.duration_days} days • {t.destination}
                  </div>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.secondary}
                      onClick={() => handleEditTour(t)}
                      disabled={deletingTour}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.secondary}
                      onClick={() => handleDeleteTour(t)}
                      disabled={deletingTour}
                    >
                      {deletingTour ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  function renderPosts() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view posts.</p>
        </div>
      );

    return (
      <div className={styles.profileCard}>
        <div className={styles.sectionHeader}>
          <h3>Post Management</h3>
          <div>
            <button
              className={styles.primary}
              onClick={() => {
                setCreateError("");
                setNewPost({ title: "", category: "", content: "" });
                setShowCreatePostModal(true);
              }}
            >
              + Create Post
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <SearchBox
            placeholder="Search posts by title or content..."
            onSearch={setPostSearchTerm}
            onClear={clearPostSearch}
            isLoading={isPostSearching}
          />
          
          <PostSearchResults
            posts={postSearchResults}
            isLoading={isPostSearching}
            error={postSearchError}
            hasSearched={hasPostSearched}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </div>

        {/* Regular Posts List */}
        {!hasPostSearched && (
          <>
            {posts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
            <div className={styles.cardGrid}>
              {posts.map((p) => (
                <div key={p.id} className={styles.cardWrapper}>
                  <div style={{ position: "relative" }}>
                    <BlogCard card={p} />
                    <div className={styles.cardActions} style={{ marginTop: 8 }}>
                      <button
                        className={styles.secondary}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(p);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.secondary}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(p);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderAttractions() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view attractions.</p>
        </div>
      );

    return (
      <div className={styles.profileCard}>
        <div className={styles.sectionHeader}>
          <h3>Attraction Management</h3>
          <div>
            <button
              className={styles.primary}
              onClick={() => {
                setCreateError("");
                setNewAttraction({ title: "", content: "", location: "", type: "" });
                setShowCreateAttractionModal(true);
              }}
            >
              + Create Attraction
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <SearchBox
            placeholder="Search attractions by title or content..."
            onSearch={setAttractionSearchTerm}
            onClear={clearAttractionSearch}
            isLoading={isAttractionSearching}
          />
          
          <AttractionSearchResults
            attractions={attractionSearchResults}
            isLoading={isAttractionSearching}
            error={attractionSearchError}
            hasSearched={hasAttractionSearched}
            onEdit={handleEditAttraction}
            onDelete={handleDeleteAttraction}
          />
        </div>

        {/* Regular Attractions List */}
        {!hasAttractionSearched && (
          <>
            {attractions.length === 0 && <p className={styles.empty}>No attractions yet.</p>}
            <div className={styles.cardGrid}>
              {attractions.map((a) => (
                <div key={a.id} className={styles.cardWrapper}>
                  <div style={{ position: "relative" }}>
                    <div className={styles.card}>
                      <div className={styles.cardTitle}>{a.title}</div>
                      <div className={styles.cardMeta}>
                        {a.location} • {a.type}
                      </div>
                    </div>
                    <div className={styles.cardActions} style={{ marginTop: 8 }}>
                      <button
                        className={styles.secondary}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAttraction(a);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.secondary}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAttraction(a);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderReviews() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view reviews.</p>
        </div>
      );

    return (
      <div>
        <div className={styles.sectionHeader}>
          <h3>Review Management</h3>
        </div>
        <div className={styles.cardGrid}>
          {reviews.length === 0 ? (
            <p className={styles.empty}>No reviews found.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className={styles.card}>
                <div className={styles.cardTitle}>Rating: {r.rating}/5</div>
                <div className={styles.cardMeta}>
                  {r.comment} • {r.created_at}
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.secondary}>Edit</button>
                  <button className={styles.secondary}>Delete</button>
                </div>
              </div>
            ))
          )}
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
            <h2 className={styles.dashboardTitle}>Admin Panel</h2>
            <nav className={styles.dashboardNav}>
              <div
                onClick={() => setCurrentSection("dashboard")}
                className={`${styles.navItem} ${currentSection === "dashboard" ? styles.active : ""}`}
              >
                <i className={`fas fa-tachometer-alt ${styles.navIcon}`} aria-hidden />
                <span>Dashboard</span>
              </div>
              <div
                onClick={() => setCurrentSection("users")}
                className={`${styles.navItem} ${currentSection === "users" ? styles.active : ""}`}
              >
                <i className={`fas fa-users ${styles.navIcon}`} aria-hidden />
                <span>Users</span>
              </div>
              <div
                onClick={() => setCurrentSection("tours")}
                className={`${styles.navItem} ${currentSection === "tours" ? styles.active : ""}`}
              >
                <i className={`fas fa-plane-departure ${styles.navIcon}`} aria-hidden />
                <span>Tours</span>
              </div>
              <div
                onClick={() => setCurrentSection("posts")}
                className={`${styles.navItem} ${currentSection === "posts" ? styles.active : ""}`}
              >
                <i className={`fas fa-newspaper ${styles.navIcon}`} aria-hidden />
                <span>Posts</span>
              </div>
              <div
                onClick={() => setCurrentSection("attractions")}
                className={`${styles.navItem} ${currentSection === "attractions" ? styles.active : ""}`}
              >
                <i className={`fas fa-landmark ${styles.navIcon}`} aria-hidden />
                <span>Attractions</span>
              </div>
              <div
                onClick={() => setCurrentSection("reviews")}
                className={`${styles.navItem} ${currentSection === "reviews" ? styles.active : ""}`}
              >
                <i className={`fas fa-star ${styles.navIcon}`} aria-hidden />
                <span>Reviews</span>
              </div>
            </nav>
          </div>
        </aside>

        <main className={styles.main}>
          <div id="dashboard-content-area" className={styles.dashboardContent}>
            {currentSection === "dashboard" && renderDashboard()}
            {currentSection === "users" && renderUsers()}
            {currentSection === "tours" && renderTours()}
            {currentSection === "posts" && renderPosts()}
            {currentSection === "attractions" && renderAttractions()}
            {currentSection === "reviews" && renderReviews()}
          </div>
        </main>
      </div>
      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className={styles.modalBackdrop} onClick={() => closeCreateModal()}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => closeCreateModal()}>
              ×
            </button>
            <h3 className={styles.modalTitle}>{newPost.id ? "Edit Post" : "Create Blog Post"}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                const title = (newPost.title || "").trim();
                const category = (newPost.category || "").trim();
                const content = (newPost.content || "").trim();
                if (!title) return setCreateError("Title is required");
                if (!content) return setCreateError("Content is required");
                setCreatingPost(true);
                try {
                  const token =
                    typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  if (newPost && newPost.id) {
                    const res = await fetch(
                      `${API_URL}/api/admin/posts/${encodeURIComponent(newPost.id)}`,
                      {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ title, category, content }),
                      }
                    );

                    const text = await res.text();
                    let parsed;
                    try {
                      parsed = JSON.parse(text);
                    } catch {
                      parsed = { message: text };
                    }

                    if (res.ok) {
                      const updated = parsed.data || parsed;
                      setPosts((p) =>
                        Array.isArray(p)
                          ? p.map((x) => (String(x.id) === String(updated.id) ? updated : x))
                          : [updated]
                      );
                      setShowCreatePostModal(false);
                      setCreateError("");
                    } else {
                      const details = parsed.details || parsed.errors || null;
                      if (Array.isArray(details) && details.length > 0) {
                        const msg = details
                          .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
                          .join("; ");
                        setCreateError(msg);
                      } else {
                        setCreateError(parsed.message || parsed.error || "Failed to update post");
                      }
                    }
                  } else {
                    const res = await fetch(`${API_URL}/api/admin/posts`, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({ title, category, content }),
                    });

                    const text = await res.text();
                    let parsed;
                    try {
                      parsed = JSON.parse(text);
                    } catch {
                      parsed = { message: text };
                    }

                    if (res.ok) {
                      const created = parsed.data || parsed;
                      setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                      setShowCreatePostModal(false);
                    } else {
                      const details = parsed.details || parsed.errors || null;
                      if (Array.isArray(details) && details.length > 0) {
                        const msg = details
                          .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
                          .join("; ");
                        setCreateError(msg);
                      } else {
                        setCreateError(parsed.message || parsed.error || "Failed to create post");
                      }
                    }
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to create post");
                } finally {
                  setCreatingPost(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Title</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost((n) => ({ ...n, title: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input
                  value={newPost.category}
                  onChange={(e) => setNewPost((n) => ({ ...n, category: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((n) => ({ ...n, content: e.target.value }))}
                  rows={6}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => closeCreateModal()}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingPost} className={styles.primary}>
                  {newPost.id
                    ? creatingPost
                      ? "Saving…"
                      : "Save changes"
                    : creatingPost
                      ? "Creating…"
                      : "Create post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Tour Modal */}
      {showCreateTourModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCreateTourModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowCreateTourModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Create New Tour</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setCreatingTour(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/tours`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(newTour),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    setTours((prev) => [parsed.data, ...prev]);
                    setShowCreateTourModal(false);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to create tour");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to create tour");
                } finally {
                  setCreatingTour(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Tour Name</label>
                <input
                  value={newTour.name}
                  onChange={(e) => setNewTour((n) => ({ ...n, name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea
                  value={newTour.description}
                  onChange={(e) => setNewTour((n) => ({ ...n, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className={styles.field}>
                <label>Price (Minor Units)</label>
                <input
                  type="number"
                  value={newTour.price_minor}
                  onChange={(e) => setNewTour((n) => ({ ...n, price_minor: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Duration (Days)</label>
                <input
                  type="number"
                  value={newTour.duration_days}
                  onChange={(e) => setNewTour((n) => ({ ...n, duration_days: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Destination</label>
                <input
                  value={newTour.destination}
                  onChange={(e) => setNewTour((n) => ({ ...n, destination: e.target.value }))}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateTourModal(false)}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingTour} className={styles.primary}>
                  {creatingTour ? "Creating..." : "Create Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCreateUserModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowCreateUserModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Create New User</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setCreatingUser(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  // Note: This would need a dedicated admin user creation endpoint
                  // For now, we'll show the form but note that user creation typically requires registration
                  setCreateError("User creation requires registration endpoint. This is a demo form.");
                  setShowCreateUserModal(false);
                } catch (err) {
                  setCreateError(err.message || "Failed to create user");
                } finally {
                  setCreatingUser(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  type="text"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser((n) => ({ ...n, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  type="text"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser((n) => ({ ...n, last_name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((n) => ({ ...n, email: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser((n) => ({ ...n, username: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Mobile</label>
                <input
                  type="tel"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser((n) => ({ ...n, mobile: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((n) => ({ ...n, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingUser} className={styles.primary}>
                  {creatingUser ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className={styles.modalBackdrop} onClick={() => setShowEditUserModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowEditUserModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Edit User Profile</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setUpdatingUser(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(newUser),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    // Update user in both main users list and search results
                    setUsers((prev) => 
                      prev.map((u) => u.id === editingUser.id ? parsed.data : u)
                    );
                    // If user is in search results, update search results too
                    if (searchResults.some((u) => u.id === editingUser.id)) {
                      setSearchTerm(searchTerm); // Trigger search refresh
                    }
                    setShowEditUserModal(false);
                    setEditingUser(null);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to update user");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to update user");
                } finally {
                  setUpdatingUser(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  type="text"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser((n) => ({ ...n, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  type="text"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser((n) => ({ ...n, last_name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((n) => ({ ...n, email: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser((n) => ({ ...n, username: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Mobile</label>
                <input
                  type="tel"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser((n) => ({ ...n, mobile: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((n) => ({ ...n, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={updatingUser} className={styles.primary}>
                  {updatingUser ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tour Modal */}
      {showEditTourModal && editingTour && (
        <div className={styles.modalBackdrop} onClick={() => setShowEditTourModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowEditTourModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Edit Tour</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setUpdatingTour(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/tours/${editingTour.id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(newTour),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    // Update tour in both main tours list and search results
                    setTours((prev) => 
                      prev.map((t) => t.id === editingTour.id ? parsed.data : t)
                    );
                    // If tour is in search results, update search results too
                    if (tourSearchResults.some((t) => t.id === editingTour.id)) {
                      setTourSearchTerm(tourSearchTerm); // Trigger search refresh
                    }
                    setShowEditTourModal(false);
                    setEditingTour(null);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to update tour");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to update tour");
                } finally {
                  setUpdatingTour(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Tour Name</label>
                <input
                  value={newTour.name}
                  onChange={(e) => setNewTour((n) => ({ ...n, name: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea
                  value={newTour.description}
                  onChange={(e) => setNewTour((n) => ({ ...n, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className={styles.field}>
                <label>Price (Minor Units)</label>
                <input
                  type="number"
                  value={newTour.price_minor}
                  onChange={(e) => setNewTour((n) => ({ ...n, price_minor: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Duration (Days)</label>
                <input
                  type="number"
                  value={newTour.duration_days}
                  onChange={(e) => setNewTour((n) => ({ ...n, duration_days: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Destination</label>
                <input
                  value={newTour.destination}
                  onChange={(e) => setNewTour((n) => ({ ...n, destination: e.target.value }))}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTourModal(false);
                    setEditingTour(null);
                  }}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={updatingTour} className={styles.primary}>
                  {updatingTour ? "Updating..." : "Update Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && editingPost && (
        <div className={styles.modalBackdrop} onClick={() => setShowEditPostModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowEditPostModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Edit Post</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setUpdatingPost(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/posts/${editingPost.id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                      title: newPost.title,
                      category: newPost.category,
                      content: newPost.content,
                    }),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    // Update post in both main posts list and search results
                    setPosts((prev) => 
                      prev.map((p) => p.id === editingPost.id ? parsed.data : p)
                    );
                    // If post is in search results, update search results too
                    if (postSearchResults.some((p) => p.id === editingPost.id)) {
                      setPostSearchTerm(postSearchTerm); // Trigger search refresh
                    }
                    setShowEditPostModal(false);
                    setEditingPost(null);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to update post");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to update post");
                } finally {
                  setUpdatingPost(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Post Title</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost((n) => ({ ...n, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input
                  value={newPost.category}
                  onChange={(e) => setNewPost((n) => ({ ...n, category: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((n) => ({ ...n, content: e.target.value }))}
                  rows={6}
                  required
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPostModal(false);
                    setEditingPost(null);
                  }}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={updatingPost} className={styles.primary}>
                  {updatingPost ? "Updating..." : "Update Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Attraction Modal */}
      {showEditAttractionModal && editingAttraction && (
        <div className={styles.modalBackdrop} onClick={() => setShowEditAttractionModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowEditAttractionModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Edit Attraction</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setUpdatingAttraction(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/attractions/${editingAttraction.id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                      title: newAttraction.title,
                      content: newAttraction.content,
                      location: newAttraction.location,
                      type: newAttraction.type,
                    }),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    // Update attraction in both main attractions list and search results
                    setAttractions((prev) => 
                      prev.map((a) => a.id === editingAttraction.id ? parsed.data : a)
                    );
                    // If attraction is in search results, update search results too
                    if (attractionSearchResults.some((a) => a.id === editingAttraction.id)) {
                      setAttractionSearchTerm(attractionSearchTerm); // Trigger search refresh
                    }
                    setShowEditAttractionModal(false);
                    setEditingAttraction(null);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to update attraction");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to update attraction");
                } finally {
                  setUpdatingAttraction(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Attraction Title</label>
                <input
                  value={newAttraction.title}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newAttraction.content}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input
                  value={newAttraction.location}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, location: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Type</label>
                <input
                  value={newAttraction.type}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, type: e.target.value }))}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAttractionModal(false);
                    setEditingAttraction(null);
                  }}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={updatingAttraction} className={styles.primary}>
                  {updatingAttraction ? "Updating..." : "Update Attraction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Attraction Modal */}
      {showCreateAttractionModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCreateAttractionModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowCreateAttractionModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>Create New Attraction</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                setCreatingAttraction(true);
                try {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  const res = await fetch(`${API_URL}/api/admin/attractions`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(newAttraction),
                  });

                  const text = await res.text();
                  let parsed;
                  try {
                    parsed = JSON.parse(text);
                  } catch {
                    parsed = { message: text };
                  }

                  if (res.ok) {
                    setAttractions((prev) => [parsed.data, ...prev]);
                    setShowCreateAttractionModal(false);
                    setCreateError("");
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to create attraction");
                  }
                } catch (err) {
                  setCreateError(err.message || "Failed to create attraction");
                } finally {
                  setCreatingAttraction(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Title</label>
                <input
                  value={newAttraction.title}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newAttraction.content}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, content: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input
                  value={newAttraction.location}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, location: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Type</label>
                <input
                  value={newAttraction.type}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, type: e.target.value }))}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateAttractionModal(false)}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingAttraction} className={styles.primary}>
                  {creatingAttraction ? "Creating..." : "Create Attraction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
