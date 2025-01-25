"use client";
import DashboardContent from "./DashboardContent";
import React, { useState } from "react";
import { FaBars, FaHome, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { MdOutlineCastForEducation } from "react-icons/md";
import { IoCloseCircleSharp } from "react-icons/io5";
import LogOutButton from "../authComponent/LogOutButton";
import InstructorContent from "./InstructorContent";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return < InstructorContent/>;
      case "course":
        return <DashboardContent />;
      case "logout":
        return <LogOutButton />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full md:w-64 bg-black  transition-width-duration-300 text-white ${
          isOpen ? "w-64" : "wd-20"
        }`}
      >
        <div className="flex items-center justify-center p-4">
          <h2
            className={`text-xl font-bold md:block ${
              isOpen ? "block" : "hidden"
            }`}
          >
            UpSkillPro
          </h2>
          <button
            className="block md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoCloseCircleSharp size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li
              className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer ${
                activeTab === "home" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome size={24} />
              <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>
                Dashboard
              </span>
            </li>
            <li
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveTab("course")}
            >
              <FaUserAlt size={24} />
              <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>
                Course Management
              </span>
            </li>
            <li
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveTab("logout")}
            >
              <FaSignOutAlt size={24} />
              <span className={`ml-4 md:block ${isOpen ? "block" : "hidden"}`}>
                Logout
              </span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="ml-20 md:ml-64 p-8 bg-gray-100 min-h-screen flex-1">
        <div className="p-4 bg-white shadow rounded">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Sidebar;
