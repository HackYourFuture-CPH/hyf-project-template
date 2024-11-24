import ClientStatus from "./ClientStatus";
import ClientCard from "./ClientCard";
import ClientTable from "./ClientTable";
import ClientNewTable from "./ClientNewTable";
function ProjectClient({
  project,
  statusCounts,
  onDelete,
}) {
  return (
    <div className="flex flec-col justify-evenly w-full">
      <div className="">
        <ClientStatus project={project} />
      </div>
      <div className="w-8/12">
        <ClientNewTable
          project={project}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default ProjectClient;
