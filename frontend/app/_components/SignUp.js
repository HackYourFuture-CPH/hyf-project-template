'use client';

import React, { useState } from 'react';

const SignUp = ({ handleSignUp, setRole, error, role }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    handleSignUp(name, email, password, phone);
  };

  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10'>
      <h2 className='text-2xl font-semibold text-primary-purple mb-4'>Create an Account as {role}</h2>
      <form onSubmit={onSubmit} className='w-full space-y-4'>
        <input
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
          required
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-purple'
        />
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-purple'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-purple'
        />
        <input
          type='text'
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder='Phone'
          className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-purple'
        />
        <button
          type='submit'
          className='w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-primary-blue-dark transition-colors'
        >
          Sign Up
        </button>
      </form>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      <button onClick={() => setRole(null)} className='mt-6 text-primary-purple hover:underline'>
        Go Back
      </button>
    </div>
  );
};

export default SignUp;
