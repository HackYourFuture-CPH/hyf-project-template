"use client";
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
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setClientId(userData.id);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error(
          "Error fetching user data: " + error.message
        );
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
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

        console.log("Client ID:", clientId);
        console.log("Form Data:", formData);

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
        console.error(
          "Failed to create project:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="scale-[1.01] text-primary-300 w-11/12 h-full">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="title">
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
          <label htmlFor="budget">
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
          <label htmlFor="startDate">
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
          <label htmlFor="startDate">
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
          <label htmlFor="deadline">Deadline</label>
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
          <label htmlFor="status">
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="description">
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
            className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
          >
            Create now
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCreateProject;
