'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelection from './_components/RoleSelection';
import LogIn from './_components/LogIn';
import SignUp from './_components/SignUp';

const Home = () => {
  const [role, setRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 p-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-lg w-full'>
        <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>
          {isSignUp ? 'Create Your Account' : 'Welcome to WFlance!'}
        </h1>

        {isSignUp ? (
          !role ? (
            <RoleSelection setRole={setRole} />
          ) : (
            <SignUp setRole={setRole} error={error} role={role} />
          )
        ) : (
          <LogIn error={error} role={role} />
        )}

        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}

        <button
          onClick={() => setIsSignUp(prev => !prev)}
          className='mt-6 w-full underline text-grey-00 font-semibold py-2 rounded-lg transition duration-300 ease-in-out'
        >
          {isSignUp ? 'Have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Home;
