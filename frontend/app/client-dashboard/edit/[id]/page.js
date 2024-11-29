"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/_components/client-dashboard-components/Spinner";

export default function EditProject({ params }) {
  const router = useRouter();

  const [projectData, setProjectData] = useState({
    name: "",
    status: "",
  });
  const [error, setError] = useState(null);

  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    async function getParams() {
      const unwrappedParams = await params;
      setProjectId(unwrappedParams.id);
    }

    getParams();
  }, [params]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProjectData(data);
        } else {
          setError("Failed to fetch project data.");
          console.error(
            "Failed to fetch project:",
            response.statusText
          );
        }
      } catch (error) {
        setError(
          `Error fetching project: ${error.message}`
        );
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${projectId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        }
      );

      if (response.ok) {
        router.push("/client-dashboard/projects");
      } else {
        setError("Failed to update project.");
        console.error(
          "Failed to update project:",
          response.statusText
        );
      }
    } catch (error) {
      setError(`Error updating project: ${error.message}`);
      console.error("Error updating project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  if (!projectId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#e0d9c7] bg-floral-pattern
       bg-repeat flex items-center justify-center px-4"
    >
      <div className="max-w-lg w-full bg-[#e0ded7] shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Edit Project
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 "
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectData.name || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#f4f5f5e1] border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-gray-600 font-medium mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={projectData.status || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#f4f5f5e1] border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="in-progress">
                In Progress
              </option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-all duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
