"use client";
import { getFieldFromCookie } from "@/app/utils/auth";
import React, { useEffect, useState } from "react";

function FormCreateProject() {
  const [clientId, setClientId] = useState(null);

  const [formData, setFormData] = useState({
    clientId: null,
    title: "",
    budget: "",
    startDate: "",
    endDate: "",
    deadline: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    const clientId = getFieldFromCookie("userId");
    setClientId(clientId);
    if (clientId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        clientId,
      }));
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        alert("Project created successfully!");

        setFormData({
          clientId: clientId,
          title: "",
          budget: "",
          startDate: "",
          endDate: "",
          deadline: "",
          status: "",
          description: "",
        });
      } else {
        const error = await response.json();
        console.error("Error details:", error);
        alert(
          `Failed to create project: ${
            error.details || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 lg:py-16 bg-white shadow-md rounded-md">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-primary-900 text-primary-100 py-6 px-8 space-y-6 rounded-b-md"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm md:text-base font-medium"
          >
            What is your project title?
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="block text-sm md:text-base font-medium"
          >
            How much is your budget?
          </label>
          <input
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            type="number"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="block text-sm md:text-base font-medium"
          >
            When do you want to start?
          </label>
          <input
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            type="date"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="block text-sm md:text-base font-medium"
          >
            When do you want finish this project?
          </label>
          <input
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            type="date"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="deadline"
            className="block text-sm md:text-base font-medium"
          >
            Deadline
          </label>
          <input
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            type="date"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="block text-sm md:text-base font-medium"
          >
            Select your project status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="">Choose Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm md:text-base font-medium"
          >
            Anything we should know about your project?
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="description, special requirements, etc.?"
          />
        </div>
        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">
            Press button and create a new project
          </p>
          <button
            type="submit"
            className="bg-accent-500 text-primary-800 font-semibold py-2 px-6 rounded-lg hover:bg-amber-200 transition-all"
          >
            Create now
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCreateProject;
