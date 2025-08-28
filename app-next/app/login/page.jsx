"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Login function
  async function submitLogin(data, event) {
    try {
      setLoginError(""); // Clear previous error
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_identifier: data.login_identifier,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setLoginError(result.message || "Failed to login");
        return;
      }
      setLoginError(""); // clear errors
      setLoginSuccess("Welcome! You are now logged in.");
      event.target.reset();
    } catch (error) {
      setLoginError(error.message || "An error occurred");
    }
  }

  // Registration function
  async function submitRegistration(data, event) {
    try {
      setRegisterError(""); // Clear previous error
      const response = await fetch("http://localhost:3000/api/auth/register", {
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

      const result = await response.json();

      if (!response.ok) {
        // Show field-specific errors:
        if (result.details && Array.isArray(result.details)) {
          setRegisterError(result.details.map((d) => `${d.field}: ${d.message}`).join("\n"));
        } else {
          setRegisterError(result.message || "Failed to complete registration");
        }
        return;
      }
      setRegisterError(""); // clear errors
      setRegisterSuccess("Registration successful! You can now log in.");
      event.target.reset();
    } catch (error) {
      setRegisterError(error.message || "An error occurred");
    }
  }

  // function to handle the login submission
  function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    submitLogin(data, e);
  }

  // function to handle the registration submission
  function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    submitRegistration(data, e);
  }

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.toggle}>
          <button className={isLogin ? styles.active : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? styles.active : ""} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>
        {isLogin ? (
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
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
        ) : (
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
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
        )}
      </div>
    </>
  );
}
