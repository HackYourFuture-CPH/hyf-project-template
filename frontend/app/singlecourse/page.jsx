"use client";
import React from "react";
import Image from "next/image";
import VideoPlayer from "../student-dashboard/components/VideoPlayer";

const courses = [
  {
    image: "/js.png",
    name: "Introduction to Javascript",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-character",
    instructor: "HackYourFuture",
    price: "20.00",
    sellingprice: "10.00",
    lectures: [
      {
        title: "Introduction to JavaScript",
        duration: "10:00",
        content: "An overview of JavaScript and its history.",
      },
      {
        title: "JavaScript Basics",
        duration: "20:00",
        content:
          "Learn the basics of JavaScript, including variables, data types, and operators.",
      },
      {
        title: "Functions and Scope",
        duration: "15:00",
        content:
          "Understand functions, scope, and how to use them in JavaScript.",
      },
      {
        title: "DOM Manipulation",
        duration: "25:00",
        content:
          "Learn how to manipulate the Document Object Model (DOM) using JavaScript.",
      },
    ],
  },
];

const CourseGrid = () => {
  return (
    <div className="bg-slate-50">
      <div className="container mx-auto">
        {courses.map((course, index) => (
          <div
            key={index}
            className="leading-loose grid lg:grid-cols-3 md:gap-3"
          >
            <div className="p-3 col-span-2 px-4 border">
              <div className="p-4">
                <VideoPlayer
                  url="/api.mp4"
                  onProgressUpdate={() => {}}
                  progressData={{}}
                  width={800}
                  height={500}
                  showControls={true}
                              />
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md mb-5">
                <h2 className="text-4xl font-semibold mb-3">{course.name}</h2>
                <h3 className="text-lg font-medium mb-3">
                  Course By:{" "}
                  <span className="text-xl font-normal">
                    {course.instructor}
                  </span>{" "}
                </h3>
                <p className="text-gray-400 mb-3">{course.description}</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h4 className="text-1xl font-semibold mt-4 bg-green-100 text-green-600 w-fit px-5">
                  {course.lectures.length} Lectures
                </h4>
                {course.lectures.map((lecture, lectureIndex) => (
                  <div key={lectureIndex} className="my-5 p-4 border">
                    <h5 className="text-xl font-medium">{lecture.title}</h5>
                    <p className="text-gray-600">{lecture.content}</p>
                    <p className="text-green-800">
                      Duration: {lecture.duration} min
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                <Image
                  src={course.image}
                  alt={course.name}
                  width={500}
                  height={500}
                  className="object-contain"
                />
                <h3 className="text-4xl font-bold text-gray-600 my-4">
                  {course.price} Kr
                </h3>
                <button className="rounded-md text-xl font-semibold bg-black text-white w-full py-5">
                  Enroll
                </button>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md leading-loose lg:col-span-1">
              <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-2 shadow-md">
                <h3 className="text-4xl font-bold text-gray-600 my-4">
                  {course.price} Kr
                </h3>
                <button className="rounded-xl text-xl font-semibold bg-black text-white w-full py-5">
                  Enroll
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;