'use client';

import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const [role, setRole] = useState(null);
  const router = useRouter();

  const handleSignIn = async provider => {
    console.log('Selected role for sign-in:', role);
    if (!role) {
      alert('Please select a role (Developer or Client) before signing in.');
      return;
    }

    console.log(`Signing in with provider ${provider} and role ${role}`);

    const callbackUrl = role === 'developer' ? '/dev-dashboard' : '/client-dashboard';

    await signIn(provider, { callbackUrl });
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await signOut();
    setRole(null);
  };

  useEffect(() => {
    if (session?.user && role) {
      const targetUrl = role === 'developer' ? '/dev-dashboard' : '/client-dashboard';
      router.push(targetUrl);
    }
  }, [session, role, router]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      {session?.user ? (
        <div className='flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-md w-80'>
          <h2 className='text-xl font-semibold'>Welcome, {session.user.name}</h2>
          <p className='text-gray-500'>Role: {role || 'Not assigned'}</p>
          <button onClick={handleSignOut} className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600'>
            Sign Out
          </button>
        </div>
      ) : (
        <div className='bg-white p-8 rounded-lg shadow-md w-80'>
          {!role ? (
            <div className='flex flex-col items-center space-y-4'>
              <h2 className='text-2xl font-bold mb-4 text-gray-700'>Select Your Role</h2>
              <button
                onClick={() => {
                  setRole('developer');
                }}
                className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Developer
              </button>
              <button
                onClick={() => {
                  setRole('client');
                }}
                className='w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
              >
                Client
              </button>
            </div>
          ) : (
            <div className='flex flex-col items-center space-y-4'>
              <h2 className='text-2xl font-bold mb-4 text-gray-700'>
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              </h2>
              <button
                onClick={() => handleSignIn('google')}
                className='w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Sign In with Google
              </button>
              <button
                onClick={() => handleSignIn('github')}
                className='w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900'
              >
                Sign In with GitHub
              </button>
              <button
                onClick={() => {
                  setRole(null);
                }}
                className='mt-4 text-gray-500 underline'
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
