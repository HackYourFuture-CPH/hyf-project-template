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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState({});

  const validateField = (field, value) => {
    let error = "";

    if (field === "name" && !value.trim()) {
      error = "Name is required";
    }
    if (
      field === "email" &&
      (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    ) {
      error = "Valid email is required";
    }
    if (field === "password" && !value.trim()) {
      error = "Password is required";
    }
    if (field === "confirmPassword") {
      if (!value.trim()) {
        error = "Please confirm your password";
      } else if (value !== password) {
        error = "Passwords do not match";
      }
    }

    setFormError((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = ["name", "email", "password", "confirmPassword"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const value =
        field === "name"
          ? name
          : field === "email"
          ? email
          : field === "password"
          ? password
          : confirmPassword;
      validateField(field, value);
      if (!value || (field === "confirmPassword" && value !== password)) {
        isValid = false;
      }
    });

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        const result = await register(formData);

        if (result.success) {
          router.push("/login");
        } else {
          setError("Registration failed. Please try again."); 
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
        console.error("Error during registration:", err);
      }
    } else {
      setError("Please correct the highlighted errors."); 
    }
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
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

        {Object.values(formError).some((err) => err) && (
          <p className="text-red-500 text-center text-sm mt-2">
            Please fix the highlighted errors.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                formError.name ? "border-red-500" : ""
              }`}
            />
            {formError.name && (
              <p className="text-red-500 text-sm mt-1">{formError.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                formError.email ? "border-red-500" : ""
              }`}
            />
            {formError.email && (
              <p className="text-red-500 text-sm mt-1">{formError.email}</p>
            )}
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
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                formError.password ? "border-red-500" : ""
              }`}
            />
            {formError.password && (
              <p className="text-red-500 text-sm mt-1">{formError.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                formError.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {formError.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formError.confirmPassword}
              </p>
            )}
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
