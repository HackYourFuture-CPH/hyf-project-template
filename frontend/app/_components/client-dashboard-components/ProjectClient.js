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
    <div className="grid grid-cols-10 grid-rows-5 gap-4">
      <div className="col-span-2 row-span-2">
        <ClientCard project={project} />
      </div>
      <div className="col-span-2 row-span-2 col-start-1 row-start-3">
        <ClientStatus statusCounts={statusCounts} />
      </div>
      <div className="col-span-7 row-span-3 col-start-4 row-start-2">
        <h2 className="text-4xl mb-5 text-accent-400 font-medium">
          Planning across your Projects
        </h2>
        <ClientNewTable
          project={project}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default ProjectClient;
