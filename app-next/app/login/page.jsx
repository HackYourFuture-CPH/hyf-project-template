"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  // Will create functions to submit the login and reservations later
  // and use them inside the handler functions

  function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    // handler function
    console.log("Login data:", data);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    // handler function
    console.log("Register data:", data);
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
            <input name="login_identifier" type="text" placeholder="Username or email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
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
