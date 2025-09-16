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
import CommentSearchResults from "../../components/CommentSearchResults/CommentSearchResults";
import FieldError from "../../components/FieldError/FieldError";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import { useUserSearch } from "../../hooks/useUserSearch";
import { useTourSearch } from "../../hooks/useTourSearch";
import { usePostSearch } from "../../hooks/usePostSearch";
import { useAttractionSearch } from "../../hooks/useAttractionSearch";
import { useCommentSearch } from "../../hooks/useCommentSearch";
import { parseValidationErrors, getFieldError, hasValidationErrors } from "../../utils/validationUtils";
import { UploadButton } from "@uploadthing/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminPage() {
  // local UI state
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // fetched data
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [bookings, setBookings] = useState([]);

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
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "", cover_image_url: "" });
  const [newTour, setNewTour] = useState({ name: "", description: "", price_minor: "", duration_days: "", cover_image_url: "" });
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", username: "", mobile: "", role: "user" });
  const [newAttraction, setNewAttraction] = useState({ title: "", content: "", location: "", type: "", cover_image_url: "" });
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
  const [validationErrors, setValidationErrors] = useState({});
  
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Error popup state
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Profile editing states
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    profile_image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  
  // Update form when user changes
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        mobile: user?.mobile || "",
        profile_image: user?.profile_image || "",
      });
      setImagePreview(user?.profile_image || "");
    }
  }, [user]);
  
  // Helper function to show success popup
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
  };
  
  // Helper function to show error popup
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

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

  // Comment search hook
  const {
    searchTerm: commentSearchTerm,
    setSearchTerm: setCommentSearchTerm,
    searchResults: commentSearchResults,
    isSearching: isCommentSearching,
    searchError: commentSearchError,
    hasSearched: hasCommentSearched,
    clearSearch: clearCommentSearch
  } = useCommentSearch();

  // Post handlers
  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      id: post.id,
      title: post.title || "",
      category: post.category || "",
      content: post.content || "",
      cover_image_url: post.photos && post.photos.length > 0 ? post.photos[0].image_url : "",
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
          showError("Post deleted successfully!");
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
      cover_image_url: attraction.photos && attraction.photos.length > 0 ? attraction.photos[0].image_url : "",
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
          showError("Attraction deleted successfully!");
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

  // Comment handlers
  const handleToggleCommentApproval = async (comment) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/admin/comments/${comment.id}/toggle-approval`, {
        method: "PUT",
        headers,
      });

      if (res.ok) {
        setPostComments((prev) => 
          prev.map((c) => 
            c.id === comment.id 
              ? { ...c, is_approved: !c.is_approved }
              : c
          )
        );
      } else {
        const errorData = await res.json();
        alert(`Failed to update comment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error updating comment: ${err.message}`);
    }
  };

  const handleDeleteComment = async (comment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this comment?\n\n"${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/admin/comments/${comment.id}`, {
          method: "DELETE",
          headers,
        });

        if (res.ok) {
          setPostComments((prev) => prev.filter((c) => c.id !== comment.id));
          showError("Comment deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete comment: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        alert(`Error deleting comment: ${err.message}`);
      }
    }
  };

  function closeCreateModal() {
    setShowCreatePostModal(false);
    setNewPost({ title: "", category: "", content: "", cover_image_url: "" });
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

        // 6) All Comments (admin endpoint)
        try {
          const resComments = await fetch(`${API_URL}/api/admin/comments`, { headers });
          const parsed = await safeParseResponse(resComments);
          if (resComments.ok && parsed.body) {
            if (mounted) setPostComments(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Comments fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Comments request error:", err.message);
        }

        // 7) All Reviews (using tour_reviews table)
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

        // 8) All Bookings (admin endpoint)
        try {
          const resBookings = await fetch(`${API_URL}/api/admin/bookings`, { headers });
          const parsed = await safeParseResponse(resBookings);
          if (resBookings.ok && parsed.body) {
            if (mounted) setBookings(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Bookings fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Bookings request error:", err.message);
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
        
        <div className={styles.dashboardSubtitle}>
          Here's an overview of your platform statistics
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <div className={styles.statNumber}>{totalUsers}</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div>
              <div className={styles.statNumber}>{totalTours}</div>
              <div className={styles.statLabel}>Total Tours</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <div>
              <div className={styles.statNumber}>{totalPosts}</div>
              <div className={styles.statLabel}>Total Posts</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
            <div>
              <div className={styles.statNumber}>{totalAttractions}</div>
              <div className={styles.statLabel}>Attractions</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
              </svg>
            </div>
            <div>
              <div className={styles.statNumber}>{totalReviews}</div>
              <div className={styles.statLabel}>Reviews</div>
            </div>
          </div>
        </div>

        <div className={styles.dashboardActions}>
          <div className={styles.actionCard}>
            <h3>Quick Actions</h3>
            <p>Manage your platform efficiently</p>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => setCurrentSection("users")}
                className={styles.actionButton}
              >
                Manage Users
              </button>
              <button 
                onClick={() => setCurrentSection("tours")}
                className={styles.actionButton}
              >
                Manage Tours
              </button>
              <button 
                onClick={() => setCurrentSection("posts")}
                className={styles.actionButton}
              >
                Manage Posts
              </button>
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
            showError("User deleted successfully!");
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
      <div className={styles.usersContainer}>
        <div className={styles.usersHeader}>
          <div className={styles.usersTitleSection}>
            <h2 className={styles.usersTitle}>User Management</h2>
            <p className={styles.usersSubtitle}>Manage and monitor all platform users</p>
          </div>
          <button 
            className={styles.addUserButton}
            onClick={() => {
              setCreateError("");
              setNewUser({ first_name: "", last_name: "", email: "", username: "", mobile: "", role: "user" });
              setShowCreateUserModal(true);
            }}
          >
            <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New User
          </button>
        </div>

        {/* Search Box */}
        <SearchBox
          placeholder="Search users (name, email, username)..."
          onSearch={setSearchTerm}
          onClear={clearSearch}
          isLoading={isSearching}
          forceLightTheme={true}
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
          <div className={styles.usersGrid}>
            {users.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👥</div>
                <h3>No users found</h3>
                <p>Start by adding your first user to the platform</p>
              </div>
            ) : (
              users.map((u) => (
                <div key={u.id} className={styles.userCard}>
                  <div className={styles.userAvatar}>
                    {u.profile_image ? (
                      <Image
                        src={u.profile_image}
                        alt={`${u.full_name || u.username} profile`}
                        width={48}
                        height={48}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {(u.first_name || u.username || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{u.full_name || u.username}</h3>
                    <p className={styles.userEmail}>{u.email}</p>
                    <div className={styles.userRole}>
                      <span className={`${styles.roleBadge} ${styles[u.role || 'user']}`}>
                        {u.role || 'user'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.userActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditUser(u)}
                      disabled={deletingUser}
                      title="Edit user"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(u)}
                      disabled={deletingUser}
                      title="Delete user"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      </svg>
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
        cover_image_url: tour.cover_image_url || ""
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
            showError("Tour deleted successfully!");
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
      <div className={styles.toursContainer}>
        <div className={styles.toursHeader}>
          <div className={styles.toursTitleSection}>
            <h2 className={styles.toursTitle}>Tour Management</h2>
            <p className={styles.toursSubtitle}>Manage and monitor all platform tours</p>
          </div>
          <button 
            className={styles.addTourButton}
            onClick={() => {
              setCreateError("");
              setNewTour({ name: "", description: "", price_minor: "", duration_days: "", cover_image_url: "" });
              setShowCreateTourModal(true);
            }}
          >
            <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Tour
          </button>
        </div>

        {/* Search Box */}
        <SearchBox
          placeholder="Search tours (name, description)..."
          onSearch={setTourSearchTerm}
          onClear={clearTourSearch}
          isLoading={isTourSearching}
          forceLightTheme={true}
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
          <div className={styles.toursGrid}>
            {tours.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🗺️</div>
                <h3>No tours found</h3>
                <p>Start by adding your first tour to the platform</p>
              </div>
            ) : (
              tours.map((t) => (
                <div key={t.id} className={styles.tourCard}>
                  <div className={styles.tourImage}>
                    {t.cover_image_url ? (
                      <Image
                        src={t.cover_image_url}
                        alt={`${t.name} tour`}
                        width={300}
                        height={200}
                        className={styles.tourImageFile}
                      />
                    ) : (
                      <div className={styles.tourImagePlaceholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.tourInfo}>
                    <h3 className={styles.tourName}>{t.name}</h3>
                    <p className={styles.tourDescription}>{t.description ? (t.description.length > 80 ? `${t.description.substring(0, 80)}...` : t.description) : 'No description available'}</p>
                    <div className={styles.tourDetails}>
                      <div className={styles.tourDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <span>{t.duration_days || 0} days</span>
                      </div>
                      <div className={styles.tourDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span>${t.price_minor ? (t.price_minor / 100).toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tourActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditTour(t)}
                      disabled={deletingTour}
                      title="Edit tour"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteTour(t)}
                      disabled={deletingTour}
                      title="Delete tour"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      </svg>
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
      <div className={styles.postsContainer}>
        <div className={styles.postsHeader}>
          <div className={styles.postsTitleSection}>
            <h2 className={styles.postsTitle}>Post Management</h2>
            <p className={styles.postsSubtitle}>Manage and monitor all platform posts</p>
          </div>
          <button 
            className={styles.addPostButton}
            onClick={() => {
              setCreateError("");
              setNewPost({ title: "", category: "", content: "", cover_image_url: "" });
              setShowCreatePostModal(true);
            }}
          >
            <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Post
          </button>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <SearchBox
            placeholder="Search posts by title or content..."
            onSearch={setPostSearchTerm}
            onClear={clearPostSearch}
            isLoading={isPostSearching}
            forceLightTheme={true}
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

        {/* All Posts List (when not searching) */}
        {!hasPostSearched && (
          <div className={styles.postsGrid}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📰</div>
                <h3>No posts found</h3>
                <p>Start by adding your first post to the platform</p>
              </div>
            ) : (
              posts.map((p) => (
                <div key={p.id} className={styles.postCard}>
                  <div className={styles.postImage}>
                    {p.cover_image_url || (p.photos && p.photos.length > 0) ? (
                      <Image
                        src={p.cover_image_url || p.photos[0].image_url}
                        alt={`${p.title} post`}
                        width={300}
                        height={200}
                        className={styles.postImageFile}
                      />
                    ) : (
                      <div className={styles.postImagePlaceholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.postInfo}>
                    <h3 className={styles.postName}>{p.title}</h3>
                    <p className={styles.postDescription}>{p.content ? (p.content.length > 80 ? `${p.content.substring(0, 80)}...` : p.content) : 'No description available'}</p>
                    <div className={styles.postDetails}>
                      <div className={styles.postDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        <span>{p.category || 'Uncategorized'}</span>
                      </div>
                      <div className={styles.postDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown date'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditPost(p)}
                      disabled={deletingPost}
                      title="Edit post"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeletePost(p)}
                      disabled={deletingPost}
                      title="Delete post"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
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

  function renderAttractions() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view attractions.</p>
        </div>
      );

    return (
      <div className={styles.attractionsContainer}>
        <div className={styles.attractionsHeader}>
          <div className={styles.attractionsTitleSection}>
            <h2 className={styles.attractionsTitle}>Attraction Management</h2>
            <p className={styles.attractionsSubtitle}>Manage and monitor all platform attractions</p>
          </div>
            <button
            className={styles.addAttractionButton}
              onClick={() => {
                setCreateError("");
              setNewAttraction({ title: "", content: "", location: "", type: "", cover_image_url: "" });
                setShowCreateAttractionModal(true);
              }}
            >
            <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Attraction
            </button>
        </div>

        {/* Search Box */}
          <SearchBox
          placeholder="Search attractions (title, content, location)..."
            onSearch={setAttractionSearchTerm}
            onClear={clearAttractionSearch}
            isLoading={isAttractionSearching}
            forceLightTheme={true}
          />
          
        {/* Search Results */}
          <AttractionSearchResults
            attractions={attractionSearchResults}
            isLoading={isAttractionSearching}
            error={attractionSearchError}
            hasSearched={hasAttractionSearched}
            onEdit={handleEditAttraction}
            onDelete={handleDeleteAttraction}
          />

        {/* All Attractions List (when not searching) */}
        {!hasAttractionSearched && (
          <div className={styles.attractionsGrid}>
            {attractions.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏛️</div>
                <h3>No attractions found</h3>
                <p>Start by adding your first attraction to the platform</p>
                      </div>
            ) : (
              attractions.map((a) => (
                <div key={a.id} className={styles.attractionCard}>
                  <div className={styles.attractionImage}>
                    {a.photos && a.photos.length > 0 ? (
                      <Image
                        src={a.photos[0].image_url}
                        alt={`${a.title} attraction`}
                        width={300}
                        height={200}
                        className={styles.attractionImageFile}
                      />
                    ) : (
                      <div className={styles.attractionImagePlaceholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9,22 9,12 15,12 15,22"></polyline>
                        </svg>
                    </div>
                    )}
                  </div>
                  <div className={styles.attractionInfo}>
                    <h3 className={styles.attractionName}>{a.title}</h3>
                    <p className={styles.attractionDescription}>{a.content ? (a.content.length > 80 ? `${a.content.substring(0, 80)}...` : a.content) : 'No description available'}</p>
                    <div className={styles.attractionDetails}>
                      <div className={styles.attractionDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{a.location || 'Unknown location'}</span>
                      </div>
                      <div className={styles.attractionDetail}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        <span>{a.type || 'Uncategorized'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.attractionActions}>
                      <button
                      className={styles.editButton}
                      onClick={() => handleEditAttraction(a)}
                      disabled={deletingAttraction}
                      title="Edit attraction"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      </button>
                      <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAttraction(a)}
                      disabled={deletingAttraction}
                      title="Delete attraction"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
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

  function renderReviews() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view reviews.</p>
        </div>
      );

    return (
      <div className={styles.reviewsContainer}>
        {/* Blog Post Comments Section */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewSectionHeader}>
            <h2 className={styles.reviewSectionTitle}>Blog Post Comments</h2>
            <p className={styles.reviewSectionSubtitle}>Manage and moderate blog post comments</p>
          </div>
          
          {/* Search Box */}
          <SearchBox
            placeholder="Search comments by content, author, or post..."
            onSearch={setCommentSearchTerm}
            onClear={clearCommentSearch}
            isLoading={isCommentSearching}
            forceLightTheme={true}
          />

          {/* Search Results */}
          <CommentSearchResults
            comments={commentSearchResults}
            isLoading={isCommentSearching}
            error={commentSearchError}
            hasSearched={hasCommentSearched}
            onToggleApproval={handleToggleCommentApproval}
            onDelete={handleDeleteComment}
          />
          
          {/* All Comments List (when not searching) */}
          {!hasCommentSearched && (
          <div className={styles.commentsGrid}>
            {postComments.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <h3>No comments found</h3>
                <p>Blog post comments will appear here</p>
              </div>
            ) : (
              postComments.map((comment) => (
                <div key={comment.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor}>
                      <span className={styles.authorName}>{comment.user?.first_name} {comment.user?.last_name}</span>
                      <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.commentStatus}>
                      <span className={`${styles.statusBadge} ${comment.is_approved ? styles.approved : styles.pending}`}>
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.commentContent}>
                    <p>{comment.content}</p>
                  </div>
                  <div className={styles.commentPost}>
                    <span className={styles.postReference}>On: {comment.post?.title || 'Unknown Post'}</span>
                  </div>
                  <div className={styles.commentActions}>
                    <button 
                      className={`${styles.actionButton} ${comment.is_approved ? styles.unapproveButton : styles.approveButton}`}
                      onClick={() => handleToggleCommentApproval(comment)}
                      title={comment.is_approved ? 'Unapprove comment' : 'Approve comment'}
                    >
                      {comment.is_approved ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                            <path d="M18 6L6 18"></path>
                            <path d="M6 6l12 12"></path>
                          </svg>
                          Unapprove
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                          Approve
                        </>
                      )}
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteComment(comment)}
                      title="Delete comment permanently"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
        </div>

      </div>
    );
  }

  function renderBookings() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view bookings.</p>
        </div>
      );

    return (
      <div className={styles.profileCard}>
        <div className={styles.sectionHeader}>
          <h3>All Bookings</h3>
          <p>Manage and view all user bookings</p>
        </div>
        
        <div className={styles.cardGrid}>
          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>No bookings found</h3>
              <p>User bookings will appear here</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.booking_id} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>{booking.trip_name || "Unknown Trip"}</h4>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: 
                          booking.booking_status === "confirmed" ? "#10b981" :
                          booking.booking_status === "cancelled" ? "#ef4444" : "#f59e0b",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}
                    >
                      {booking.booking_status || "pending"}
                    </span>
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      <span><strong>Type:</strong> {booking.booking_type || "tour"}</span>
                      <span><strong>User:</strong> {booking.username || "Unknown"}</span>
                      <span><strong>Booked:</strong> {new Date(booking.booked_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <button
                      className={styles.secondary}
                      onClick={() => {
                        // View booking details
                        console.log("View booking:", booking);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.primary}
                      onClick={async () => {
                        // Update booking status
                        try {
                          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                          const headers = { "Content-Type": "application/json" };
                          if (token) headers.Authorization = `Bearer ${token}`;
                          
                          const newStatus = booking.booking_status === "confirmed" ? "cancelled" : "confirmed";
                          
                          const res = await fetch(
                            `${API_URL}/api/admin/bookings/${booking.booking_type}/${booking.booking_id}`,
                            {
                              method: "PUT",
                              headers,
                              body: JSON.stringify({ booking_status: newStatus }),
                            }
                          );
                          
                          if (res.ok) {
                            // Update local state
                            setBookings(prev => 
                              prev.map(b => 
                                b.booking_id === booking.booking_id 
                                  ? { ...b, booking_status: newStatus }
                                  : b
                              )
                            );
                            showSuccess(`Booking ${newStatus} successfully!`);
                          } else {
                            const error = await res.json().catch(() => ({ error: "Failed to update booking" }));
                            showError(error.error || "Failed to update booking");
                          }
                        } catch (err) {
                          showError("Failed to update booking");
                        }
                      }}
                    >
                      {booking.booking_status === "confirmed" ? "Cancel" : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderBookings() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view bookings.</p>
        </div>
      );

    return (
      <div className={styles.profileCard}>
        <div className={styles.sectionHeader}>
          <h3>All Bookings</h3>
          <p>Manage all user bookings across the platform</p>
        </div>
        
        <div className={styles.cardGrid}>
          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>No bookings found</h3>
              <p>User bookings will appear here</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.booking_id} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.cardTitle}>{booking.trip_name || "Unknown Trip"}</h4>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: 
                          booking.booking_status === "confirmed" ? "#10b981" :
                          booking.booking_status === "cancelled" ? "#ef4444" : "#f59e0b",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}
                    >
                      {booking.booking_status || "pending"}
                    </span>
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.field}>
                      <strong>User:</strong> {booking.username || "Unknown User"}
                    </div>
                    <div className={styles.field}>
                      <strong>Type:</strong> {booking.booking_type || "tour"}
                    </div>
                    <div className={styles.field}>
                      <strong>Booked:</strong> {new Date(booking.booked_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <button
                      className={styles.secondary}
                      onClick={() => {
                        // View booking details
                        console.log("View booking:", booking);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.primary}
                      onClick={async () => {
                        // Update booking status
                        try {
                          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                          const headers = { "Content-Type": "application/json" };
                          if (token) headers.Authorization = `Bearer ${token}`;
                          
                          const newStatus = booking.booking_status === "confirmed" ? "cancelled" : "confirmed";
                          const res = await fetch(
                            `${API_URL}/api/admin/bookings/${booking.booking_type}/${booking.booking_id}`,
                            {
                              method: "PUT",
                              headers,
                              body: JSON.stringify({ booking_status: newStatus }),
                            }
                          );
                          
                          if (res.ok) {
                            // Refresh bookings
                            const resBookings = await fetch(`${API_URL}/api/admin/bookings`, { headers });
                            const parsed = await resBookings.json();
                            if (resBookings.ok) {
                              setBookings(parsed.data || parsed || []);
                            }
                          }
                        } catch (err) {
                          console.error("Failed to update booking:", err);
                        }
                      }}
                    >
                      {booking.booking_status === "confirmed" ? "Cancel" : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderProfile() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view profile.</p>
        </div>
      );

    function onChange(e) {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    }

    function onPwChange(e) {
      const { name, value } = e.target;
      setPwForm((p) => ({ ...p, [name]: value }));
      setPwMessage("");
    }

    async function onUploadComplete(res) {
      try {
        if (!res || res.length === 0) return;
        const url = res[0].url;
        setImagePreview(url);
        setForm((f) => ({ ...f, profile_image: url }));
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const payload = { profile_image: url };
        const resp = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => null);
          if (data && (data.data || data)) {
            setUser(data.data || data);
            // Update localStorage with new user data
            localStorage.setItem("user", JSON.stringify(data.data || data));
            // Dispatch custom event to notify Header component
            window.dispatchEvent(new CustomEvent("userUpdated"));
          }
        }
      } catch {
        // silent
      }
    }

    async function onSubmit(e) {
      e.preventDefault();
      setFormError("");
      const fname = (form.first_name || "").trim();
      const lname = (form.last_name || "").trim();
      const mobileVal = (form.mobile || "").trim();
      if (!fname) return setFormError("First name is required");
      if (!lname) return setFormError("Last name is required");
      const mobilePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!mobileVal) return setFormError("Mobile number is required");
      if (!mobilePattern.test(mobileVal)) return setFormError("Please enter a valid mobile number");
      setSubmitting(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const payload = { first_name: fname, last_name: lname, mobile: mobileVal };
        if (form.profile_image && typeof form.profile_image === "string") {
          const v = form.profile_image;
          if (v.startsWith("http://") || v.startsWith("https://")) payload.profile_image = v;
        }
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
        if (res.ok) {
          setUser(parsed.data || parsed);
          // Update localStorage with new user data
          localStorage.setItem("user", JSON.stringify(parsed.data || parsed));
          // Dispatch custom event to notify Header component
          window.dispatchEvent(new CustomEvent("userUpdated"));
          setEditing(false);
        } else {
          setFormError(parsed.message || "Failed to update profile");
        }
      } catch (err) {
        setFormError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }

    async function onSubmitPassword(e) {
      e.preventDefault();
      setPwMessage("");
      const { current_password, new_password, new_password_confirmation } = pwForm;
      if (!current_password) return setPwMessage("Current password is required");
      if (!new_password) return setPwMessage("New password is required");
      if (new_password.length < 6) return setPwMessage("New password must be at least 6 characters");
      if (new_password !== new_password_confirmation) return setPwMessage("New passwords do not match");
      setPwSubmitting(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/api/users/change-password`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ current_password, new_password }),
        });
        const text = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
        if (res.ok) {
          setPwMessage("Password updated successfully");
          setPwForm({ current_password: "", new_password: "", new_password_confirmation: "" });
        } else {
          setPwMessage(parsed.message || "Failed to update password");
        }
      } catch (err) {
        setPwMessage("Network error. Please try again.");
      } finally {
        setPwSubmitting(false);
      }
    }

    return (
      <div className={styles.profileCard}>
        <h2 className={styles.dashboardTitle}>My Profile</h2>
        
        <div className={styles.profileRow}>
          <div>
            <div className={styles.avatarWrap}>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="avatar"
                  className={styles.avatar}
                  width={120}
                  height={120}
                />
              ) : (
                <div className={styles.avatar}>
                  {(user?.full_name || user?.first_name || user?.username || "")[0]}
                </div>
              )}
            </div>
            {editing ? (
              <div style={{ marginTop: 12 }}>
                <UploadButton
                  endpoint="imageUploader"
                  className={styles.uploadThingButton}
                  aria-label="Upload profile photo"
                  onClientUploadComplete={(res) => onUploadComplete(res)}
                  onUploadError={() => {}}
                >
                  Upload photo
                </UploadButton>
              </div>
            ) : null}
          </div>

          <div className={styles.info}>
            {editing ? (
              <form onSubmit={onSubmit}>
                <div className={styles.field}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={onChange}
                    required
                  />
                </div>
                {formError ? <div className={styles.error}>{formError}</div> : null}
                <div className={styles.formActions}>
                  <button type="submit" disabled={submitting} className={styles.primary}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className={styles.secondary}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.name}>
                  {user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username}
                </div>
                <div className={styles.field}>
                  <strong>Email:</strong> {user?.email}
                </div>
                <div className={styles.field}>
                  <strong>Mobile:</strong> {user?.mobile || "Not provided"}
                </div>
                <div className={styles.field}>
                  <strong>Role:</strong> {user?.role || "user"}
                </div>
                <div className={styles.field}>
                  <strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                </div>
                <button onClick={() => setEditing(true)} className={styles.primary}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Password Change Section */}
        <div style={{ marginTop: 32 }}>
          <h3 className={styles.sectionHeader}>Change Password</h3>
          {changingPassword ? (
            <form onSubmit={onSubmitPassword} className={styles.passwordContainer}>
              <div className={styles.field}>
                <label>Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={pwForm.current_password}
                  onChange={onPwChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={pwForm.new_password}
                  onChange={onPwChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={pwForm.new_password_confirmation}
                  onChange={onPwChange}
                  required
                />
              </div>
              {pwMessage ? (
                <div className={pwMessage.includes("successfully") ? styles.success : styles.error}>
                  {pwMessage}
                </div>
              ) : null}
              <div className={styles.formActions}>
                <button type="submit" disabled={pwSubmitting} className={styles.primary}>
                  {pwSubmitting ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setChangingPassword(false)}
                  className={styles.secondary}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setChangingPassword(true)} className={styles.secondary}>
              Change Password
            </button>
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
        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className={styles.mobileMenuOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`${styles.aside} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.sidebarCard}>
            <div className={styles.mobileMenuHeader}>
              <h2 className={styles.dashboardTitle}>Admin Panel</h2>
              <button 
                className={styles.mobileMenuClose}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <nav className={styles.dashboardNav}>
              <div
                onClick={() => {
                  setCurrentSection("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "dashboard" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <span>Dashboard</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("users");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "users" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <span>Users</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("tours");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "tours" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <span>Tours</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("posts");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "posts" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <span>Posts</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("attractions");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "attractions" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                </div>
                <span>Attractions</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("reviews");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "reviews" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                  </svg>
                </div>
                <span>Reviews</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("bookings");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "bookings" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <span>Bookings</span>
              </div>
              <div
                onClick={() => {
                  setCurrentSection("profile");
                  setIsMobileMenuOpen(false);
                }}
                className={`${styles.navItem} ${currentSection === "profile" ? styles.active : ""}`}
              >
                <div className={styles.navIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>My Profile</span>
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
            {currentSection === "bookings" && renderBookings()}
            {currentSection === "profile" && renderProfile()}
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
                setValidationErrors({});
                const title = (newPost.title || "").trim();
                const category = (newPost.category || "").trim();
                const content = (newPost.content || "").trim();
                
                
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
                        body: JSON.stringify({ title, category, content, cover_image_url: newPost.cover_image_url }),
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
                      // Delay success popup to ensure modal is closed
                      setTimeout(() => {
                        showSuccess("Post updated successfully!");
                      }, 100);
                    } else {
                      const parsedErrors = parseValidationErrors(parsed);
                      if (hasValidationErrors(parsedErrors)) {
                        setValidationErrors(parsedErrors);
                      } else {
                        setCreateError(parsed.message || parsed.error || "Failed to update post");
                      }
                    }
                  } else {
                    const res = await fetch(`${API_URL}/api/admin/posts`, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({ title, category, content, cover_image_url: newPost.cover_image_url }),
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
                      setCreateError("");
                      // Delay success popup to ensure modal is closed
                      setTimeout(() => {
                        showSuccess("Post created successfully!");
                      }, 100);
                    } else {
                      const parsedErrors = parseValidationErrors(parsed);
                      if (hasValidationErrors(parsedErrors)) {
                        setValidationErrors(parsedErrors);
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
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost((n) => ({ ...n, title: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'title')} fieldName="Title" />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input
                  type="text"
                  value={newPost.category}
                  onChange={(e) => setNewPost((n) => ({ ...n, category: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'category')} fieldName="Category" />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((n) => ({ ...n, content: e.target.value }))}
                  rows={6}
                />
                <FieldError error={getFieldError(validationErrors, 'content')} fieldName="Content" />
              </div>
              <div className={styles.field}>
                <label>Cover Image</label>
                <div className={styles.uploadSection}>
                  {newPost.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newPost.cover_image_url}
                        alt="Post cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewPost((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewPost((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
                setValidationErrors({});
                
                // Validate that cover image is provided
                if (!newTour.cover_image_url) {
                  setCreateError("Cover image is required to create a tour");
                  return;
                }
                
                
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
                    showSuccess("Tour created successfully!");
                  } else {
                    const parsedErrors = parseValidationErrors(parsed);
                    if (hasValidationErrors(parsedErrors)) {
                      setValidationErrors(parsedErrors);
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to create tour");
                    }
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
                  type="text"
                  value={newTour.name}
                  onChange={(e) => setNewTour((n) => ({ ...n, name: e.target.value }))}
                  placeholder="Enter tour name..."
                  required
                />
                <FieldError error={getFieldError(validationErrors, 'name')} fieldName="Tour Name" />
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea
                  value={newTour.description}
                  onChange={(e) => setNewTour((n) => ({ ...n, description: e.target.value }))}
                  rows={4}
                />
                <FieldError error={getFieldError(validationErrors, 'description')} fieldName="Description" />
              </div>
              <div className={styles.field}>
                <label>Price (Minor Units)</label>
                <input
                  type="number"
                  value={newTour.price_minor}
                  onChange={(e) => setNewTour((n) => ({ ...n, price_minor: e.target.value ? parseInt(e.target.value) || 0 : 0 }))}
                />
                <FieldError error={getFieldError(validationErrors, 'price_minor')} fieldName="Price" />
              </div>
              <div className={styles.field}>
                <label>Duration (Days)</label>
                <input
                  type="number"
                  value={newTour.duration_days}
                  onChange={(e) => setNewTour((n) => ({ ...n, duration_days: e.target.value ? parseInt(e.target.value) || 0 : 0 }))}
                />
                <FieldError error={getFieldError(validationErrors, 'duration_days')} fieldName="Duration" />
              </div>
              <div className={styles.field}>
                <label>Currency Code</label>
                <input
                  type="text"
                  value={newTour.currency_code || ''}
                  onChange={(e) => setNewTour((n) => ({ ...n, currency_code: e.target.value }))}
                  placeholder="e.g., USD, EUR"
                />
                <FieldError error={getFieldError(validationErrors, 'currency_code')} fieldName="Currency Code" />
              </div>
              <div className={styles.field}>
                <label>Capacity</label>
                <input
                  type="number"
                  value={newTour.capacity || ''}
                  onChange={(e) => setNewTour((n) => ({ ...n, capacity: e.target.value ? parseInt(e.target.value) || 0 : 0 }))}
                  placeholder="Maximum participants"
                />
                <FieldError error={getFieldError(validationErrors, 'capacity')} fieldName="Capacity" />
              </div>
              <div className={styles.field}>
                <label>Cover Image (Required)</label>
                <div className={styles.uploadSection}>
                  {newTour.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newTour.cover_image_url}
                        alt="Tour cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewTour((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewTour((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
                <button type="submit" disabled={creatingTour || !newTour.cover_image_url} className={styles.primary}>
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
                    showSuccess("User updated successfully!");
                  } else {
                    const parsedErrors = parseValidationErrors(parsed);
                    if (hasValidationErrors(parsedErrors)) {
                      setValidationErrors(parsedErrors);
                  } else {
                    setCreateError(parsed.message || parsed.error || "Failed to update user");
                    }
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
                  type="text"
                  value={newTour.name}
                  onChange={(e) => setNewTour((n) => ({ ...n, name: e.target.value }))}
                  placeholder="Enter tour name..."
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
                  onChange={(e) => setNewTour((n) => ({ ...n, price_minor: e.target.value ? parseInt(e.target.value) || 0 : 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label>Duration (Days)</label>
                <input
                  type="number"
                  value={newTour.duration_days}
                  onChange={(e) => setNewTour((n) => ({ ...n, duration_days: e.target.value ? parseInt(e.target.value) || 0 : 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label>Cover Image</label>
                <div className={styles.uploadSection}>
                  {newTour.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newTour.cover_image_url}
                        alt="Tour cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewTour((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewTour((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
                      cover_image_url: newPost.cover_image_url,
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
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost((n) => ({ ...n, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input
                  type="text"
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
              <div className={styles.field}>
                <label>Cover Image</label>
                <div className={styles.uploadSection}>
                  {newPost.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newPost.cover_image_url}
                        alt="Post cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewPost((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewPost((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
                      cover_image_url: newAttraction.cover_image_url,
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
                    setTimeout(() => {
                      showSuccess("Attraction updated successfully!");
                    }, 100);
                  } else {
                    const parsedErrors = parseValidationErrors(parsed);
                    if (hasValidationErrors(parsedErrors)) {
                      setValidationErrors(parsedErrors);
                    } else {
                      setCreateError(parsed.message || parsed.error || "Failed to update attraction");
                    }
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
                  type="text"
                  value={newAttraction.title}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, title: e.target.value }))}
                  required
                />
                <FieldError error={getFieldError(validationErrors, 'title')} fieldName="Title" />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newAttraction.content}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, content: e.target.value }))}
                  rows={4}
                  required
                />
                <FieldError error={getFieldError(validationErrors, 'content')} fieldName="Content" />
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input
                  type="text"
                  value={newAttraction.location}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, location: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'location')} fieldName="Location" />
              </div>
              <div className={styles.field}>
                <label>Type</label>
                <input
                  type="text"
                  value={newAttraction.type}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, type: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'type')} fieldName="Type" />
              </div>
              <div className={styles.field}>
                <label>Cover Image</label>
                <div className={styles.uploadSection}>
                  {newAttraction.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newAttraction.cover_image_url}
                        alt="Attraction cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewAttraction((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewAttraction((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
                    setTimeout(() => {
                      showSuccess("Attraction created successfully!");
                    }, 100);
                  } else {
                    const parsedErrors = parseValidationErrors(parsed);
                    if (hasValidationErrors(parsedErrors)) {
                      setValidationErrors(parsedErrors);
                    } else {
                      setCreateError(parsed.message || parsed.error || "Failed to create attraction");
                    }
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
                  type="text"
                  value={newAttraction.title}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, title: e.target.value }))}
                  required
                />
                <FieldError error={getFieldError(validationErrors, 'title')} fieldName="Title" />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newAttraction.content}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, content: e.target.value }))}
                  rows={4}
                />
                <FieldError error={getFieldError(validationErrors, 'content')} fieldName="Content" />
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input
                  type="text"
                  value={newAttraction.location}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, location: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'location')} fieldName="Location" />
              </div>
              <div className={styles.field}>
                <label>Type</label>
                <input
                  type="text"
                  value={newAttraction.type}
                  onChange={(e) => setNewAttraction((n) => ({ ...n, type: e.target.value }))}
                />
                <FieldError error={getFieldError(validationErrors, 'type')} fieldName="Type" />
              </div>
              <div className={styles.field}>
                <label>Cover Image</label>
                <div className={styles.uploadSection}>
                  {newAttraction.cover_image_url ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={newAttraction.cover_image_url}
                        alt="Attraction cover preview"
                        width={200}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewAttraction((n) => ({ ...n, cover_image_url: "" }))}
                        className={styles.removeImageButton}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setNewAttraction((n) => ({ ...n, cover_image_url: res[0].url }));
                        }
                      }}
                      onUploadError={(error) => {
                        setCreateError(`Upload failed: ${error.message}`);
                      }}
                    />
                  )}
                </div>
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
      
      {/* Success Popup */}
      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        duration={3000}
      />
      
      {/* Error Popup */}
      <ErrorPopup
        message={errorMessage}
        isVisible={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        duration={4000}
      />
    </main>
  );
}
