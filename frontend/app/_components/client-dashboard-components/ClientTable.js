import { sendPostJsonRequest } from "@/app/utils/resHandler";
import Link from "next/link";

function ClientTable({
  title,
  clientId,
  status,
  deadline,
  onDelete,
}) {
  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${project.name}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/project/${project.id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onDelete(project.id); // Notify parent to update the UI
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">
            Project Name
          </th>
          <th className="px-4 py-2 border-b">Status</th>
          <th className="px-4 py-2 border-b">Deadline</th>
          <th className="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td className="px-4 py-2 border-b">{title}</td>
          <td className="px-4 py-2 border-b">{status}</td>
          <td className="px-4 py-2 border-b">{deadline}</td>
          <td className="px-4 py-2 border-b">
            <div className="project-item">
              {/* <h3>{project.name}</h3> */}
              {/* <Link */}
              {/* // href={`/client-dashboard/projects/edit/${project.id}`} */}
              {/* > */}
              <button className="edit-button">Edit</button>
              {/* </Link> */}
              <button
                onClick={onDelete}
                className="delete-button"
              >
                Delete
              </button>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2">
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ClientTable;
