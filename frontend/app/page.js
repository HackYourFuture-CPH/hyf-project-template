'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelection from './components/RoleSelection';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { handleSignUp, handleSignIn } from './utils/auth';

const Home = () => {
  const [role, setRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUpClick = async (name, email, password, phone) => {
    const result = await handleSignUp(name, email, password, phone, role);
    if (result.success) {
      router.push(role === 'developer' ? '/dev-dashboard' : '/client-dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleSignInClick = async (email, password) => {
    const result = await handleSignIn(email, password);
    if (result.success) {
      router.push(result.role === 'developer' ? '/dev-dashboard' : '/client-dashboard');
    } else {
      setError(result.message);
    }
  };

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
            <SignUp handleSignUp={handleSignUpClick} setRole={setRole} error={error} role={role} />
          )
        ) : (
          <SignIn handleSignIn={handleSignInClick} error={error} />
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
