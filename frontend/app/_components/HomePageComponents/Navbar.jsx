"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="container mx-auto bg-white border-b-2 border-black">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link href="/" passHref>
          <Image src="/Logo.png" alt="Logo" width={150} height={40} priority />

          </Link>
        </div>

        <ul className="hidden md:flex flex-1  justify-center items-center gap-6">
          <li><a href="#home" className="text-gray-700 hover:text-blue-500 font-semibold">Home</a></li>
          <li><a href="#explore" className="text-gray-700 hover:text-blue-500 font-semibold">Explore</a></li>
          <li><a href="#courses" className="text-gray-700 hover:text-blue-500 font-semibold">Courses</a></li>
          <li><a href="#instructor" className="text-gray-700 hover:text-blue-500 font-semibold">Become an Instructor</a></li>
          <li><a href="#contact" className="text-gray-700 hover:text-blue-500 font-semibold">Contact Us</a></li>
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600">Sign Up</button>
          <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Log In</button>
        </div>

        <div
          className="md:hidden flex flex-col space-y-1 cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-1 bg-black"></div>
          <div className="w-6 h-1 bg-black"></div>
          <div className="w-6 h-1 bg-black"></div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-20">
          <div className="flex justify-end p-4">
            <button
              onClick={closeMenu}
              className="text-gray-700 font-bold text-xl focus:outline-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 text-lg">
            <a href="#home" onClick={closeMenu} className="text-gray-700 hover:text-blue-500 font-semibold">Home</a>
            <a href="#explore" onClick={closeMenu} className="text-gray-700 hover:text-blue-500 font-semibold">Explore</a>
            <a href="#courses" onClick={closeMenu} className="text-gray-700 hover:text-blue-500 font-semibold">Courses</a>
            <a href="#instructor" onClick={closeMenu} className="text-gray-700 hover:text-blue-500 font-semibold">Become an Instructor</a>
            <a href="#contact" onClick={closeMenu} className="text-gray-700 hover:text-blue-500 font-semibold">Contact Us</a>
            <button onClick={closeMenu} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600">Sign Up</button>
            <button onClick={closeMenu} className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">Log In</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;