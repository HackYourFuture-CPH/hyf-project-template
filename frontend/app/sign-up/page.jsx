"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../components/Input"
import { Loader, Lock, Mail, User, ArrowBigLeftIcon } from "lucide-react";
import Link from "next/link";
import PasswordStrengthChecker from "../../components/PasswordStrengthChecker";

const SignUpPage = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const isLoading = true;

  const handleSubmit = (e)=>{
    e.preventDefault();
 if (confirmpassword !== password) {
   window.alert("Password must match");
   return;
 }
  }
 

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
            <form onClick={handleSubmit}>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm Password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordStrengthChecker password={password} />
              <motion.button
                className="w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white font-bold rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-600 focus:outline-none focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-2"
                type="submit"
                disabled={isLoading}
              >
                {!isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </div>

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

export default SignUpPage;
