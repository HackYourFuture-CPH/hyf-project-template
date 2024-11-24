"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      <label>
        Project Name:
        <input
          type="text"
          name="name"
          value={projectData.name || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Status:
        <select
          name="status"
          value={projectData.status || ""}
          onChange={handleChange}
          required
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </form>
  );
}
