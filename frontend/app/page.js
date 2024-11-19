"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  return <button onClick={() => router.push("/login")}>Login</button>;
};

export default Home;
