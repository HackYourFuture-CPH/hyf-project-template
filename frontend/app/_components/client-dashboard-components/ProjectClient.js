import ClientStatus from "./ClientStatus";
import ClientCard from "./ClientCard";
import ClientTable from "./ClientTable";
function ProjectClient({ project, statusCounts }) {
  const { title, client_id, status, deadline } = project;

  return (
    <div className="grid grid-cols-10 grid-rows-5 gap-4">
      <div className="col-span-2 row-span-2">
        <ClientCard />
      </div>
      <div className="col-span-2 row-span-2 col-start-1 row-start-3">
        <ClientStatus statusCounts={statusCounts} />
      </div>
      <div className="col-span-7 row-span-3 col-start-4 row-start-2">
        <h2 className="text-4xl mb-5 text-accent-400 font-medium">
          Planning across your Projects
        </h2>
        <ClientTable
          title={title}
          clientId={client_id}
          status={status}
          deadline={deadline}
        />
      </div>
    </div>
  );
}

export default ProjectClient;
