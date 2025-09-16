"use client";

import Link from "next/link";
import React from "react";
import styles from "./planner.module.css";

export default function PlannerPage() {
  return (
    <main className={styles.container}>
      <h1>Trip Planner</h1>
      <p>This is a placeholder trip planner details page. Implement the planner flow here.</p>
      <Link href="/" className={styles.back}>← Back to Home</Link>
    </main>
  );
}
