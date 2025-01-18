'use client';

import React from 'react';

const Button = ({ styles, value, onClick, type = 'button' }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-fit rounded-[10px] bg-blue-500 px-6 py-2 text-[18px] font-bold text-white outline-none duration-500 hover:bg-blue-700 ${styles}`}
    >
      {value}
    </button>
  );
};

export default Button;
