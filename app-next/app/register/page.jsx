"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { register } from "@/action";

const SignUpForm = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && password !== e.target.value) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };
  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-black-500 hover:text-gray-700 bg-blue-500 hover:bg-gray-600 rounded-full w-20 h-8 flex items-center justify-center"
        >
          Close
        </button>
        <div className="text-center flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-500 flex items-center">
            Join{" "}
            <span className="ml-2 flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-500" />
              <span className="ml-1">MovieApp</span>
            </span>
          </h1>
        </div>

        <p className="text-gray-600 text-sm text-center mt-2">
          Create your account to get started.
        </p>

        <form className="mt-6 space-y-4" action={register}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <label
              htmlFor="show-password"
              className="ml-2 block text-sm text-gray-700"
            >
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-black hover:from-blue-600 hover:to-gray-800"
            disabled={!!error || !password || !confirmPassword}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
