"use client";
import React, { useState, useEffect } from "react";
import { Check, GraduationCap, X, ArrowLeft } from "lucide-react";
import VideoPlayer from "../student-dashboard/components/VideoPlayer";
import { completeCourse } from "@/constants";
import { Button } from "@mui/material";
import Link from "next/link";

const CourseProgress = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(() => {
    return completeCourse.reduce((acc, course) => {
      course.lectures.forEach((lecture) => (acc[lecture.id] = false));
      return acc;
    }, {});
  });

  useEffect(() => {
    if (completeCourse?.length && completeCourse[0]?.lectures?.length) {
      setSelectedLecture(completeCourse[0].lectures[0]);
    }
  }, [completeCourse]);

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };
  const toggleComplete = (course) => {
    setCompletedLectures((prev) => {
      const updatedLectures = { ...prev };
      course.lectures.forEach(
        (lecture) =>
          (updatedLectures[lecture.id] = !Object.values(prev).every(
            (val) => val === true
          ))
      );
      return updatedLectures;
    });
  };
  const handleVideoEnd = () => {
    if (selectedLecture) {
      setCompletedLectures((prev) => ({
        ...prev,
        [selectedLecture.id]: true,
      }));
    }
  };

  return (
    <div className="bg-white w-full h-full">
      <div className="container mx-auto bg-white p-5">
        <div className="w-full bg-green-100 py-2 px-5 rounded-lg ">
          <Link
            href="/student-dashboard"
            className="flex gap-2 text-green-600 font-semibold"
          >
            <ArrowLeft /> Back To Dashboard
          </Link>
        </div>

        {completeCourse?.map((course) => (
          <div key={course.id} className="p-5 my-5">
            <div className="flex justify-between items-center mb-5 px-3">
              <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-2">
                <GraduationCap />
                {course.name}
              </h2>
              <Button
                onClick={() => toggleComplete(course)}
                className={`${
                  Object.values(completedLectures).every((val) => val === true)
                    ? "bg-black text-white  px-10 py-3 shadow-lg rounded-xl"
                    : "bg-green-600 text-white  px-10 py-3 shadow-lg rounded-xl"
                } `}
              >
                {Object.values(completedLectures).every((val) => val === true)
                  ? "Reset Progress"
                  : "Mark As Complete"}
              </Button>
            </div>
            <div className="flex flex-col gap-5 lg:flex-row md:flex-col aspect-video:16/9">
              <div className="relative max-w-[1200px] mx-auto">
                <VideoPlayer
                  url={selectedLecture?.videoUrl}
                  width={800}
                  height={500}
                  showControls={true}
                  autoPlay={true}
                  onVideoEnd={handleVideoEnd} // Pass handleVideoEnd here
                />
                <p className="absolute top-5 font-semibold text-white ml-4">
                  {selectedLecture?.title || "Select a Lecture"}
                </p>
                <h2 className="text-3xl font-semibold my-3">
                  {selectedLecture?.title}
                </h2>
                <p className="text-gray-400 mb-2">{selectedLecture?.content}</p>
                <Button
                  disabled={
                    !Object.values(completedLectures).every(
                      (val) => val === true
                    )
                  }
                  variant="contained"
                >
                  Download Certificate
                </Button>
              </div>
              <div className="w-full px-3">
                <span className="text-sm font-semibold mt-4 bg-green-100 text-green-600 w-fit px-3 mb-3">
                  {course.lectures.length} Lectures
                </span>
                {course.lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    onClick={() => handleLectureClick(lecture)}
                    className={`${
                      selectedLecture && selectedLecture?.id === lecture.id
                        ? "mb-2 p-3 border bg-green-200 rounded-lg shadow-md border-gray-300 hover:border-gray-600 border-r-4 flex gap-3 cursor-pointer"
                        : "mb-2 p-3 border bg-white rounded-lg shadow-md border-gray-300 hover:border-gray-600 border-r-4 flex gap-3 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {completedLectures[lecture.id] ? (
                        <Check className="text-green-100 bg-green-700 rounded-full " />
                      ) : (
                        <X className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xl font-medium">{lecture.title}</h5>
                      <p className="text-gray-400 ">{lecture.content}</p>
                      <p className="text-green-800">
                        Duration: {lecture.videoUrl?.length} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
