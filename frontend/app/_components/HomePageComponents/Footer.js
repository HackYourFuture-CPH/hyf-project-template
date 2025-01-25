import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaRSS,
  FaInstagram,
  FaRss,
} from "react-icons/fa";

import Image from "next/image";
import {
  whoWeAre,
  course,
  topcategories,
  support,
  recommend,
} from "@/constants";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black">
      {/* Top Section */}
      <div className="container mx-auto pt-32">
        <div className="flex justify-center items-center flex-wrap gap-10 lg:gap-20 pb-24">
          <div className="flex items-center gap-4">
            <Image
              src="/guarantee.png"
              height={40}
              width={40}
              alt="UpSkillpro"
            />
            <p className="text-white font-semibold text-lg">
              30 day money back guarantee
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image src="/support.png" height={40} width={40} alt="UpSkillpro" />
            <p className="text-white font-semibold text-lg">
              Support teams across the world
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image src="/save.png" height={40} width={40} alt="UpSkillpro" />
            <p className="text-white font-semibold text-lg">
              Safe & Secure online payment
            </p>
          </div>
        </div>

        <hr className="" />

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 px-5 justify-center gap-8 lg:px-32  pt-20 pb-10">
          <div>
            <h3 className="text-white font-semibold text-xl mb-4">
              WHO WE ARE
            </h3>
            <div className="flex flex-col gap-3">
              {whoWeAre.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className="text-white hover:text-darkColor text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-semibold text-xl mb-4">COURSES</h3>
            <div className="flex flex-col gap-3">
              {course.map((items, index) => (
                <Link
                  href={items.path}
                  key={index}
                  className="text-white hover:text-darkColor text-sm"
                >
                  {items.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xl mb-4">
              TOP CATEGORIES
            </h3>
            <div className="flex flex-col gap-3">
              {topcategories.map((items, index) => (
                <Link
                  href={items.path}
                  key={index}
                  className="text-white hover:text-darkColor text-sm"
                >
                  {items.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-semibold text-xl mb-4">SUPPORT</h3>
            <div className="flex flex-col gap-3">
              {support.map((items, index) => (
                <Link
                  href={items.path}
                  key={index}
                  className="text-white hover:text-darkColor text-sm"
                >
                  {items.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-semibold text-xl mb-4">
              WE RECOMMEND
            </h3>
            <div className="flex flex-col gap-3">
              {recommend.map((items, index) => (
                <Link
                  href={items.path}
                  key={index}
                  className="text-white hover:text-darkColor text-sm"
                >
                  {items.name}
                </Link>
              ))}
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white my-4">
                NEWSLETTER
              </h3>
              <p className="text-white text-sm mb-4">
                Subscribe to our newsletter
              </p>
              <form className="space-y-3 flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="bg-white flex justify-between items-center py-5 px-10">
        <div className="flex gap-5">
          <a href="#">
            <FaTwitter className="size-7" />
          </a>
          <a href="#">
            <FaFacebook className="size-7" />
          </a>
          <a href="#">
            <FaRss className="size-7" />
          </a>
          <a href="#">
            <FaInstagram className="size-7" />
          </a>
        </div>
        <p className="text-black font-medium text-lg">
          &copy; COPYRIGHT BYTECODERS 2025 - Terms & Conditions | Privacy Policy
        </p>
        {/* UpSkillPro Logo */}
        <div className="">
          <Image
            src="/upskillpro_logo.png"
            alt="UpSkillPro Logo"
            height={100}
            width={100}
            className=""
          />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
