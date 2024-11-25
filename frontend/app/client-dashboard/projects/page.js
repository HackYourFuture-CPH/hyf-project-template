"use client";
import { useState, useEffect } from "react";

import ProjectClient from "@/app/_components/client-dashboard-components/ProjectClient";
import { useRouter } from "next/navigation";
// export const metadata = {
//   title: "projects",
// };

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();

          setUserName(userData.name);
          setUserId(userData.id);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError(
          "Error fetching user data: " + error.message
        );
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `/api/projects/client/${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const projectData = await response.json();
          console.log(projectData);
          setProjects(projectData);
        } else {
          setError(
            `Failed to fetch projects: ${response.statusText}`
          );
        }
      } catch (error) {
        setError(
          `Error fetching projects: ${error.message}`
        );
      }
    };

    fetchProjects();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const projectData = await response.json();

        setProjects((prevProjects) =>
          prevProjects.filter(
            (project) => project.id !== id
          )
        );
      } else {
        console.error(
          "Failed to delete project:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          You do not have any projects.
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Start organizing your work by creating a new
          project. Once you create one, it will appear here.
        </p>
        <button
          onClick={() =>
            router.push("/client-dashboard/create-project")
          }
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Create a New Project
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {projects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-4xl font-medium text-accent-400">
            Planning across your Projects
          </h2>
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-11">
            {projects.map((project) => (
              <ProjectClient
                key={project.id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
