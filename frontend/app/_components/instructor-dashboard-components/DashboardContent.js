"use client";
import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const courses = [
  {
    image: "/hand2.png",
    name: "Introduction to JS",
    description: "Learn Javascript in 2025",
  },
  {
    image: "/system.png",
    name: "Introduction to React",
    description: "Learn Javascript FullStack",
  },
];

const DashboardContent = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("instructor-dashboard/add-course");
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="font-extrabold text-3xl">All Courses</CardTitle>
          <Button className="p-5 hover:bg-[#374151]" onClick={handleNavigation}>
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="container my-10 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
              {courses.map((course, index) => (
                <div
                  key={`course-${index}`}
                  className=" relative border  border-gray-300 rounded-md shadow-md  leading-loose 	"
                >
                  <Image
                    src={course.image}
                    alt={`Image of ${course.name}`}
                    width={500}
                    height={500}
                    className="object-contain "
                  />
                  <span className="bg-green-700 text-white absolute font-medium top-7 px-2">
                    BEST SELLER
                  </span>
                  <div className="p-3">
                    <h2 className="text-lg font-semibold ">{course.name}</h2>
                    <p className="text-gray-400">{course.description}</p>
                    <button className="px-2 py-1.5 min-w-20 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                      Add new lecture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
