"use client";
import { useState, useEffect } from "react";
import ProjectClient from "@/app/_components/client-dashboard-components/ProjectClient";

// export const metadata = {
//   title: "projects",
// };

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setUserName(userData.name);
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
          `/api/projects/${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
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
      const response = await fetch(`/api/project/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
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
    return <div>You do not have any projects.</div>;
  }

  const statusCounts = {
    completed: projects.filter(
      (p) => p.status === "completed"
    ).length,
    inProgress: projects.filter(
      (p) => p.status === "in-progress"
    ).length,
    pending: projects.filter((p) => p.status === "pending")
      .length,
  };

  return (
    <div className="">
      {projects.length > 0 && (
        <div className="flex flex-col">
          {projects.map((project) => (
            <ProjectClient
              key={project.id}
              project={project}
              onDelete={handleDelete}
              statusCounts={statusCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
