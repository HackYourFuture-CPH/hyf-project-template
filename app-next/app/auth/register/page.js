"use client";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../styles/commonStyles.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const initialLoginFormdata = {
  email: "",
  password: "",
  name: "",
  role: "VOLUNTEER",
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialLoginFormdata);

  const router = useRouter();
  const { isLoading, register, error } = useAuthStore();
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const userId = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    console.log("user id", userId);
    if (userId) {
      alert("Registration Successful");
      router.push("/auth/login");
    } else {
      console.log(error);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Your Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
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
        <div className={styles.field}>
          <label htmlFor="role" className={styles.label}>
            Select Role
          </label>
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ELDER">Elder</option>
          </select>
        </div>
        {error ? <p className={styles.red}>{error}</p> : null}
        <button type="submit" className={styles.button}>
          {isLoading ? " Registering.." : "Register"}
        </button>

        <p className={styles.helper}>
          Forgot Password{" "}
          <Link href="/auth/forgot-password" className={styles.link}>
            Reset Password
          </Link>
        </p>

        <p className={styles.helper}>
          Already have an account{" "}
          <Link href="/auth/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
