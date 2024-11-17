'use client';
import React, { useState } from 'react';
import { handleSignUp } from '../utils/auth';

const SignUp = ({ setRole, error, role }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role_name: role,
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    await handleSignUp(formData);
  };

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Name', required: true },
    { name: 'email', type: 'email', placeholder: 'Email', required: true },
    { name: 'password', type: 'password', placeholder: 'Password', required: true },
    { name: 'phone', type: 'text', placeholder: 'Phone', required: false },
  ];

  return (
    <div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto mt-10'>
      <h2 className='text-2xl font-semibold text-primary-purple mb-4'>Create an Account as {role}</h2>
      <form onSubmit={onSubmit} className='w-full space-y-4'>
        {inputFields.map(field => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            className='w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:border-primary-purple'
          />
        ))}
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
