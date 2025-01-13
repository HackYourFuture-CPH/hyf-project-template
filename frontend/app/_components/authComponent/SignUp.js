"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { makePostRequest } from "@/utils/api";
import { motion } from "framer-motion";
import Input from "@/components/ui/input";
import { Loader, Lock, Mail, User, ArrowBigLeftIcon } from "lucide-react";
import PasswordStrengthChecker from "../HomePageComponents/PasswordStrengthChecker";

const SignUp = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role) {
      setSelectedRole(role);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    if (confirmPassword !== formData.password) {
      window.alert("Password must match");
      return;
    }
    try {
      await makePostRequest(
        "api/signup",
        { ...formData, role: selectedRole },
        {},
        () => {
          toast.success("Signed In successfully. Login Now");
          router.push("/login");
        }
      );
    } catch (error) {
      console.error("Error during signup:", error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("SignUp failed , Please try again later");
      }
    }
    setIsLoading(false);
  };
  return (
    <div className=" h-max  md:flex justify-between ">
      <div className="hidden md:flex bg-[url('/hand2.jpg')] backdrop-opacity-20 bg-cover  w-1/3">
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
            <h2 className="mb-6 text-2xl text-center font-semibold text-white">
              Create An UpSkillPro Account
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <PasswordStrengthChecker password={formData.password} />
              <motion.button
                className="w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white font-bold rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-600 focus:outline-none focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "SignUp"
                )}
              </motion.button>
            </form>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-gray-400 text-sm">
              Already Have An <span className="font-semibold">UpSkillPro</span>{" "}
              Account?{" "}
              <Link
                href="/login"
                className="text-white hover:underline font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
