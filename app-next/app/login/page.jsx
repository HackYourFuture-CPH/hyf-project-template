"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { PlayCircle } from "lucide-react";
import { login } from "@/action";

const ComingSoon = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-b from-gray-900 to-blue-900 p-6 rounded-3xl shadow-2xl border border-blue-700/50 backdrop-blur-md text-white text-center relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ✖
        </button>
        <h1 className="text-3xl font-bold text-blue-300">Coming Soon</h1>
        <p className="text-blue-200 mt-2">
          This feature is under development and will be available soon. Stay
          tuned!
        </p>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Google Login Success:", response);
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleCloseLoginForm = () => router.push("/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setFormError("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <button
        onClick={handleCloseLoginForm}
        className="absolute top-2 right-2 text-black-500 hover:text-gray-700 bg-blue-500 hover:bg-gray-600 rounded-full w-20 h-8 flex items-center justify-center"
      >
        Close
      </button>

      {isModalOpen && <ComingSoon onClose={closeModal} />}

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-500 flex items-center">
            Welcome to{" "}
            <span className="ml-2 flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-500" />
              <span className="ml-1">MovieApp</span>
            </span>
          </h1>
        </div>

        <p className="text-gray-600 text-sm text-center mt-2">
          Please log in using the form below.
        </p>

        {formError && (
          <div className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded-lg">
            {formError}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgotPassword"
                className="text-blue-500 text-sm hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-black ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-600 hover:to-gray-800"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-600">Or</div>

        <div className="space-y-2">
          <button
            onClick={openModal}
            className="flex items-center justify-center w-full bg-white text-gray-700 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5 mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.14 0 5.97 1.18 8.18 3.1l6.09-6.1C34.14 3.08 29.3 1 24 1 14.83 1 7.05 6.62 3.68 14.15l7.1 5.51C12.53 12.6 17.84 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.3 0 10.14-2.08 13.76-5.46l-7.07-5.57c-2.22 1.93-5.06 3.1-8.17 3.1-6.14 0-11.36-4.21-13.17-9.95l-7.08 5.47C7.05 41.38 14.83 44 24 44z"
              />
              <path
                fill="#4A90E2"
                d="M43.61 20.08H24v7.84h11.06c-1.17 3.08-3.13 5.55-5.67 7.22l7.07 5.57c3.97-3.7 6.58-9.13 6.58-15.74 0-1.17-.12-2.31-.33-3.41z"
              />
              <path
                fill="#FBBC05"
                d="M10.83 28.43c-.5-1.46-.79-3.03-.79-4.68s.29-3.22.79-4.68l-7.1-5.51c-1.55 3.13-2.45 6.64-2.45 10.19s.9 7.06 2.45 10.19l7.1-5.51z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            onClick={openModal}
            className="flex items-center justify-center w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
            >
              <path d="M18.87 13.62c-.03-3.15 2.57-4.68 2.68-4.76-1.46-2.12-3.74-2.41-4.55-2.44-1.94-.2-3.79 1.15-4.76 1.15-.98 0-2.51-1.12-4.14-1.09-2.14.03-4.13 1.25-5.24 3.15-2.24 3.87-.57 9.6 1.6 12.74 1.05 1.48 2.29 3.15 3.93 3.09 1.57-.07 2.16-1.01 4.04-1.01s2.39.99 4.04 1c1.67.01 2.72-1.51 3.76-2.98 1.14-1.67 1.61-3.29 1.64-3.39-.04-.02-3.17-1.22-3.2-4.85zM15.31 3.91c.82-1.02 1.38-2.42 1.23-3.83-1.19.05-2.63.8-3.45 1.82-.75.91-1.42 2.36-1.24 3.75 1.31.1 2.65-.67 3.46-1.74z" />
            </svg>
            Continue with Apple
          </button>
          <button
            onClick={openModal}
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
            >
              <path d="M22.675 0h-21.35c-.734 0-1.325.59-1.325 1.325v21.351c0 .733.591 1.324 1.325 1.324h11.488v-9.276h-3.118v-3.622h3.118v-2.671c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.099 2.793.144v3.239l-1.916.001c-1.503 0-1.794.715-1.794 1.763v2.311h3.588l-.467 3.622h-3.121v9.276h6.116c.734 0 1.325-.591 1.325-1.324v-21.351c0-.735-.591-1.325-1.325-1.325z" />
            </svg>
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
    <LoginForm />
  </GoogleOAuthProvider>
);

export default App;
