'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { handleLogIn } from '../utils/auth';
import { getUserInfo, getUserPathByRole } from '../utils/userUtil';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  const onSubmit = async e => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please fill in both fields.');
      return;
    }

    await handleLogIn(email, password, async () => {
      const userInfo = await getUserInfo();
      const userRole = userInfo.role;
      Cookies.set('userRole', userRole);
      router.push(getUserPathByRole(userRole));
    });
  };

  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto mt-10'>
      <h2 className='text-2xl font-semibold text-primary-blue mb-4'>{'Sign In'}</h2>
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
      {formError && <p className='mt-4 text-red-500'>{formError}</p>}
    </div>
  );
};

export default LogIn;
