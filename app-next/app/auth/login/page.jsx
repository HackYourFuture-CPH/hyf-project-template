"use client";  

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
   
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow-md text-white">
        <h2 className="text-2xl mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            placeholder="Enter password"
          />
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}