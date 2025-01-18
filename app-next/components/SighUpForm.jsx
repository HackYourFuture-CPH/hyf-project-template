"use client";

import React from "react";
import { PlayCircle } from "lucide-react";

const SignUpForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* App Icon and Title */}
        <div className="text-center flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-500 flex items-center">
            Join{" "}
            <span className="ml-2 flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-500" />
              <span className="ml-1">MovieApp</span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm text-center mt-2">
          Create your account to get started.
        </p>

        {/* Sign Up Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
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
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-black hover:from-blue-600 hover:to-gray-800"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
