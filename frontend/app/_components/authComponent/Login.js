"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { makeGetRequest, makePostRequest } from "@/utils/api";
import { returnPathByRole } from "@/utils/userUtil";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { ArrowBigLeftIcon, Loader, Lock, Mail } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/input";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userInfo = await makePostRequest("api/login", formData, {
        credentials: "include",
      });
      const { user } = userInfo;

      // Set cookies
      Cookies.set("userName", user.name);
      Cookies.set("userRole", user.role);
      Cookies.set("userEmail", user.email);

      toast.success("Logged in successfully! 🎉");

      // Redirect based on role
      const dashboardPath = returnPathByRole(user.role);
      window.location.replace(dashboardPath);
    } catch (error) {
      console.error("Error during login process:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" h-max  md:flex justify-between  ">
      <div className="hidden md:flex bg-[url('/system.jpg')] backdrop-opacity-20 bg-cover  w-1/3">
        <div className="flex justify-center items-center  h-10 m-10">
          <ArrowBigLeftIcon className="size-10 text-white" />
          <Link href="/" className="text-white">
            Go Back Home
          </Link>
        </div>
      </div>

      <div className="min-h-screen w-2/3 flex items-center justify-center relative overflow-hidden bg-white px-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800 bg-opacity-2 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden"
        >
          <div className="p-8">
            <h2 className="mb-6 text-3xl text-center font-semibold text-white">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                type="email"
                name="email"
                label="Email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                icon={Lock}
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="flex items-center mb-6">
                <Link href="/" className="text-sm text-white hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                className="w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white font-bold rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-600 focus:outline-none focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto " />
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-white text-sm">
              Don't have an <span className="font-semibold">UpSkillPro</span>{" "}
              Account?{" "}
              <Link
                href="/sign-up"
                className="text-white hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
