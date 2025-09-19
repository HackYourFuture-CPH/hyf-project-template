"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const images = [
  "/hero-images/dino-reichmuth-A5rCN8626Ck-unsplash.webp",
  "/hero-images/drif-riadh-YpkuRn54y4w-unsplash.webp",
  "/hero-images/jack-anstey-XVoyX7l9ocY-unsplash.webp",
  "/hero-images/neom-STV2s3FYw7Y-unsplash.webp",
  "/hero-images/nils-nedel-ONpGBpns3cs-unsplash.webp",
  "/hero-images/pietro-de-grandi-T7K4aEPoGGk-unsplash.webp",
  "/hero-images/rebe-adelaida-zunQwMy5B6M-unsplash.webp",
];

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (currentImage >= images.length) {
      setCurrentImage(0);
    }
  }, [images.length, currentImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Clear form fields and messages when the page mounts to avoid showing
  // previously-entered credentials (browser back navigation or autofill).
  useEffect(() => {
    try {
      if (loginFormRef?.current) loginFormRef.current.reset();
    } catch (e) {}
    try {
      if (registerFormRef?.current) registerFormRef.current.reset();
    } catch (e) {}
    // clear any success/error banners so forms appear empty/fresh
    setLoginSuccess("");
    setRegisterSuccess("");
    setLoginError("");
    setRegisterError("");
    // cleanup toast timer on unmount
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  // helper to safely parse JSON or return text
  async function safeParseResponse(res) {
    const text = await res.text();
    try {
      return { body: JSON.parse(text), raw: text };
    } catch {
      return { body: null, raw: text };
    }
  }

  // Login function
  async function submitLogin(data, event) {
    try {
      setLoginError("");
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_identifier: data.login_identifier,
          password: data.password,
        }),
      });

      const parsed = await safeParseResponse(res);

      if (!res.ok) {
        // prefer structured message if available, otherwise show raw text
        const msg = parsed.body?.message || parsed.raw || `HTTP ${res.status}`;
        setLoginError(msg);
        return;
      }

      // success: parsed.body expected
      setLoginError("");
      setLoginSuccess(parsed.body?.message || "Welcome! You are now logged in.");

      // persist token and user data so other pages can use it
      if (parsed.body?.token) {
        try {
          localStorage.setItem("token", parsed.body.token);
        } catch (e) {
          console.warn("Failed to persist token to localStorage", e);
        }
      }
      // persist user object as well so Header and other components can read it
      if (parsed.body?.user) {
        try {
          localStorage.setItem("user", JSON.stringify(parsed.body.user));
        } catch (e) {
          console.warn("Failed to persist user data to localStorage", e);
        }
      }

      // try to reset the submitted form (both direct event target and form ref)
      try {
        event?.target?.reset?.();
      } catch (e) {}
      try {
        if (loginFormRef?.current) loginFormRef.current.reset();
      } catch (e) {}
      // show a brief toast so the user sees the success message, then navigate
      try {
        const userRole = parsed.body?.user?.role || "user";
        // clear any existing timer
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
          toastTimerRef.current = null;
        }
        setShowToast(true);
        // delay navigation slightly so toast is visible
        toastTimerRef.current = setTimeout(() => {
          setShowToast(false);
          try {
            if (userRole === "admin") {
              router.push("/admin");
            } else {
              router.push("/user");
            }
          } catch (e) {
            /* ignore navigation errors in non-browser tests */
          }
        }, 1000);
      } catch (e) {
        /* ignore navigation errors in non-browser tests */
      }
    } catch (error) {
      setLoginError(error.message || "An error occurred");
    }
  }

  // Registration function
  async function submitRegistration(data, event) {
    try {
      setRegisterError("");
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          username: data.username,
          password: data.password,
          password_confirmation: data.password_confirmation,
          mobile: data.mobile,
        }),
      });

      const parsed = await safeParseResponse(res);

      if (!res.ok) {
        // handle structured validation details or fallback to raw HTML/text
        if (parsed.body?.details && Array.isArray(parsed.body.details)) {
          setRegisterError(parsed.body.details.map((d) => `${d.field}: ${d.message}`).join("\n"));
        } else {
          const msg = parsed.body?.message || parsed.raw || `HTTP ${res.status}`;
          setRegisterError(msg);
        }
        return;
      }

      setRegisterError("");
      setRegisterSuccess(parsed.body?.message || "Registration successful! You can now log in.");

      // persist token and user data if returned
      if (parsed.body?.token) {
        try {
          localStorage.setItem("token", parsed.body.token);
        } catch (e) {
          console.warn("Failed to persist token to localStorage", e);
        }
      }

      // Store user data including role for redirect logic
      if (parsed.body?.user) {
        try {
          localStorage.setItem("user", JSON.stringify(parsed.body.user));
        } catch (e) {
          console.warn("Failed to persist user data to localStorage", e);
        }
      }

      event.target.reset();

      // Redirect based on user role (new users are typically "user" role)

      // reset the registration form reliably
      try {
        event?.target?.reset?.();
      } catch (e) {}
      try {
        if (registerFormRef?.current) registerFormRef.current.reset();
      } catch (e) {}

      try {
        const userRole = parsed.body?.user?.role || "user";
        if (userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } catch (e) {
        /* ignore navigation errors in non-browser tests */
      }
    } catch (error) {
      setRegisterError(error.message || "An error occurred");
    }
  }

  // handlers unchanged...
  function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    submitLogin(data, e);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    submitRegistration(data, e);
  }

  return (
    <div
      className={styles.backgroundWrapper}
      style={{
        backgroundImage: `url(${images[currentImage]})`,
      }}
    >
      {/* Inline toast */}
      {showToast && (
        <div className={styles.toastWrapper}>
          <div className={styles.toastBox} role="status" aria-live="polite">
            {loginSuccess || "Logged in"}
          </div>
        </div>
      )}
      <div className={styles.loginContainer}>
        <div className={styles.toggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>
            <svg
              className={styles.toggleIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Login</span>
          </button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>
            <svg
              className={styles.toggleIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Register</span>
          </button>
        </div>
        {/* Login Form */}
        <form
          ref={loginFormRef}
          autoComplete="off"
          className={`${styles.form} ${!isLogin ? styles.hidden : ""}`}
          onSubmit={handleLoginSubmit}
        >
          <div className={styles.titleContainer}>
            <svg
              className={styles.titleIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2 className={styles.title}>Login</h2>
          </div>
          {/* Hidden dummy fields to catch browser autofill and keep visible fields empty */}
          <input
            type="text"
            name="fake-username"
            autoComplete="username"
            style={{ display: "none" }}
            aria-hidden="true"
          />
          <input
            type="password"
            name="fake-password"
            autoComplete="current-password"
            style={{ display: "none" }}
            aria-hidden="true"
          />
          {loginSuccess && (
            <div className={styles.success} aria-live="polite">
              <svg
                className={styles.successIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              {loginSuccess}
            </div>
          )}
          {loginError && (
            <div className={styles.error} aria-live="polite">
              <svg
                className={styles.errorIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {loginError}
            </div>
          )}
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              name="login_identifier"
              type="text"
              placeholder="Username or email"
              required
              autoComplete="off"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="off"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            <svg
              className={styles.buttonIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10,17 15,12 10,7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Login</span>
          </button>
        </form>
        {/* Register Form */}
        <form
          ref={registerFormRef}
          autoComplete="off"
          className={`${styles.form} ${isLogin ? styles.hidden : ""}`}
          onSubmit={handleRegisterSubmit}
        >
          <div className={styles.titleContainer}>
            <svg
              className={styles.titleIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className={styles.title}>Register</h2>
          </div>
          {registerSuccess && (
            <div className={styles.success} aria-live="polite">
              <svg
                className={styles.successIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              {registerSuccess}
            </div>
          )}
          {registerError && (
            <div className={styles.error} aria-live="polite">
              <svg
                className={styles.errorIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {registerError}
            </div>
          )}
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              name="first_name"
              type="text"
              placeholder="First name"
              required
              autoComplete="given-name"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              name="last_name"
              type="text"
              placeholder="Last name"
              required
              autoComplete="family-name"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input name="email" type="email" placeholder="Email" required autoComplete="email" />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              autoComplete="username"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirm password"
              required
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <svg
              className={styles.inputIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input name="mobile" type="text" placeholder="Mobile" required autoComplete="tel" />
          </div>
          <button type="submit" className={styles.submitButton}>
            <svg
              className={styles.buttonIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Register</span>
          </button>
        </form>
      </div>
    </div>
  );
}
