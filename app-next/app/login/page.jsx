"use client";

import { useState, useEffect } from "react";
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
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

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
      // persist token so other pages (dashboard) can use it
      if (parsed.body?.token) {
        try {
          localStorage.setItem("token", parsed.body.token);
        } catch (e) {
          console.warn("Failed to persist token to localStorage", e);
        }
      }
      event.target.reset();
      // navigate to dashboard so the user sees their profile
      try {
        router.push("/user");
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
      // persist token if returned and redirect to dashboard
      if (parsed.body?.token) {
        try {
          localStorage.setItem("token", parsed.body.token);
        } catch (e) {
          console.warn("Failed to persist token to localStorage", e);
        }
      }
      event.target.reset();
      try {
        router.push("/user");
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
      <div className={styles.loginContainer}>
        <div className={styles.toggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>
        {/* Login Form */}
        <form
          className={`${styles.form} ${!isLogin ? styles.hidden : ""}`}
          onSubmit={handleLoginSubmit}
        >
          <h2 className={styles.title}>Login</h2>
          {loginSuccess && (
            <div className={styles.success} aria-live="polite">
              {loginSuccess}
            </div>
          )}
          {loginError && (
            <div className={styles.error} aria-live="polite">
              {loginError}
            </div>
          )}
          <input name="login_identifier" type="text" placeholder="Username or email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        {/* Register Form */}
        <form
          className={`${styles.form} ${isLogin ? styles.hidden : ""}`}
          onSubmit={handleRegisterSubmit}
        >
          <h2 className={styles.title}>Register</h2>
          {registerSuccess && (
            <div className={styles.success} aria-live="polite">
              {registerSuccess}
            </div>
          )}
          {registerError && (
            <div className={styles.error} aria-live="polite">
              {registerError}
            </div>
          )}
          <input name="first_name" type="text" placeholder="First name" required />
          <input name="last_name" type="text" placeholder="Last name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm password"
            required
          />
          <input name="mobile" type="text" placeholder="Mobile" required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
