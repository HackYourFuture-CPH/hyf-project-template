"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player"; 
import Image from "next/image";

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState();

  const fetchCourseData = async () => {
    const response = await fetch(`/courses/${id}`);
    const data = await response.json();
    setCourse(data);
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto">
        <div className="leading-loose grid lg:grid-cols-3 md:gap-3">
          <div className="p-3 col-span-2 px-4 border">
            <div className="p-4">
              <ReactPlayer
                url="https://youtu.be/lELqghacmuE?si=v3JQhKVt5Z6_Z9n6"
                controls={true}
              />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md mb-5">
              <h2 className="text-4xl font-semibold mb-3">{course.name}</h2>
              <h3 className="text-lg font-medium mb-3">
                Course By:{" "}

                <span className="text-xl font-normal">
                  {course.instructor}
                </span>
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
      </div>
    </div>
  );
};

export default CoursePage;
