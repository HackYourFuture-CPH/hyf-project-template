"use client";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const initialLoginFormdata = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [formData, setFormData] = useState(initialLoginFormdata);
  const router = useRouter();
  const { isLoading, login } = useAuthStore();
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginSuccess = await login(formData.email, formData.password);
    console.log(loginSuccess);
    if (loginSuccess) {
      alert("login Successful");
    }
    const user = useAuthStore.getState().user;
    console.log(user);
    if (user?.role === "ADMIN") {
      router.push("/admin");
    } else if (user?.role === "VOLUNTEER") {
      router.push("/services");
    } else {
      router.push("/");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            required
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>
          {isLoading ? " Login in.." : "Login"}
        </button>

        <p className={styles.helper}>
          Forgot Password{" "}
          <Link href="/auth/forgot-password" className={styles.link}>
            Reset Password
          </Link>
        </p>

        <p className={styles.helper}>
          Don&apos;t have an account{" "}
          <Link href="/auth/register" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
