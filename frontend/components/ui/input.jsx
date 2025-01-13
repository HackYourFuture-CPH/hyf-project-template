import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size5 text-gray-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-white  rounded-lg border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-500 transition duration-200 "
      />
    </div>
  );
};

export default Input;