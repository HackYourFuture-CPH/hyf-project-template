'use client';

import React, { useState } from 'react';

const SignIn = ({ handleSignIn, setRole, error, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10'>
      <h2 className='text-2xl font-semibold text-primary-blue mb-4'>{role ? `Sign In as ${role}` : 'Sign In'}</h2>
      <form onSubmit={onSubmit} className='w-full space-y-4'>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-blue'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-blue'
        />
        <button
          type='submit'
          className='w-full bg-primary-purple text-white py-2 rounded-lg hover:bg-primary-purple-dark transition-colors'
        >
          Sign In
        </button>
      </form>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      <button onClick={() => setRole(null)} className='mt-6 text-primary-blue hover:underline'>
        Go Back
      </button>
    </div>
  );
};

export default SignIn;
