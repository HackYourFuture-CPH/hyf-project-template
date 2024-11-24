import React from 'react';

const RoleSelection = ({ setRole }) => {
  return (
    <div className='flex flex-col items-center space-y-4'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Select Your Role</h2>

      <button
        onClick={() => setRole('Developer')}
        className='w-full px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple-dark transition duration-300 ease-in-out'
      >
        Developer
      </button>

      <button
        onClick={() => setRole('Client')}
        className='w-full px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition duration-300 ease-in-out'
      >
        Client
      </button>
    </div>
  );
};

export default RoleSelection;
