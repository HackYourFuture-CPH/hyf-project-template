import ClientStatus from "./ClientStatus";

import ClientNewTable from "./ClientNewTable";

function ProjectClient({
  project,
  statusCounts,
  onDelete,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4 flex flex-col">
      <div className="w-full">
        <ClientStatus project={project} />
      </div>
      <div className="w-full">
        <ClientNewTable
          project={project}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default ProjectClient;
