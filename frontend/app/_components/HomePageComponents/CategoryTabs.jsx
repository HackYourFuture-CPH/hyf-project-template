"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CategorySection = () => {
  const pathname = usePathname();
  const categoryList = [
    { name: "Programming", path: "/" },
    { name: "Web Design", path: "/" },
    { name: "User Experience", path: "/" },
    { name: "Design", path: "/" },
    { name: "Data Analysis", path: "/" },
    { name: "Data Engineering", path: "/" },
    { name: "View All", path: "/" },
  ];
  return (
    <div className="w-full h-auto">
      <div>
        <div>
          <div className=" container mx-auto py-10 px-10 md:py-10  ">
            <h2 className=" text-5xl text-center font-bold leading-tight	 text-gray-500 lg:text-7xl">
              Study Smarter, Dream
              <br /> Bigger, Achieve More.
            </h2>
          </div>
          <div className="flex items-center justify-center flex-wrap my-5 gap-2 ">
            <h2 className="mr-5 font-semibold">Top Categories</h2>
            {categoryList.map((item) => (
              <div key={item.name} className="mb-4">
                <Link
                  href={item.path}
                  className={
                    pathname === item.name
                      ? "border border-gray-700 bg-black text-white py-2 px-5"
                      : "border border-gray-700 py-2 px-5 hover:bg-slate-950 hover:text-white transition ease-in-out delay-150"
                  }
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
