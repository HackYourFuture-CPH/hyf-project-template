import React from "react";
import Image from "next/image";
import { courses } from "../../../constants";

const CourseGrid = () => {
  
  return (
    <div className="container my-10 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        {courses.map((course, index) => (
          <div
            key={index}
            className=" relative border  border-gray-300 rounded-md shadow-md  leading-loose 	"
          >
            <Image
              src={course.image}
              alt={course.name}
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
              <h3 className="text-lg font-medium">
                Course By:{" "}
                <span className="text-xl font-normal">{course.instructor}</span>{" "}
              </h3>
              <div className="flex gap-3">
                {" "}
                <h3 className="text-xl font-bold">
                  {course.sellingprice} Kr
                </h3>{" "}
                <h3 className="text-xl font-bold text-gray-300 line-through ">
                  {course.price} Kr
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
