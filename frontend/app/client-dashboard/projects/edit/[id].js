import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;
  const [projectData, setProjectData] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${id}`,
          { method: "post", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setProjectData(data); // Populate form fields
        } else {
          console.error("Failed to fetch project");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        router.push("/client-dashboard/projects");
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Project Name:
        <input
          type="text"
          name="name"
          value={projectData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Status:
        <select
          name="status"
          value={projectData.status}
          onChange={handleChange}
          required
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
