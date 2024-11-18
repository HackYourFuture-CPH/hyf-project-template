import ProjectClient from "@/app/_components/client-dashboard-components/ProjectClient";

export const metadata = {
  title: "projects",
};
const URL =
  "https://wflance-production.up.railway.app/api/pj";

export default async function Page() {
  const response = await fetch(URL);
  const projects = await response.json();
  console.log(projects);
  if (!response.ok) {
    return (
      <div>
        Error fetching projects: {response.statusText}
      </div>
    );
  }

  if (!projects) {
    return <div>No projects found.</div>;
  }
  if (projects.error) {
    return (
      <div>Error fetching projects: {projects.error}</div>
    );
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
              statusCounts={statusCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
