"use client";
import React, { useState } from "react";
import LogIn from "../_components/AuthComponents/LogIn";

const LogInPage = () => {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 p-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-lg w-full'>
        <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>Welcome to WFlance!</h1>

        <LogIn error={error} role={role} />

        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}

        <a
          href='/signup'
          className='mt-6 w-full underline text-grey-00 font-semibold py-2 rounded-lg transition duration-300 ease-in-out text-center block'
        >
          Need an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default LogInPage;
