function ClientTable({
  title,
  clientId,
  status,
  deadline,
}) {
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
            <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2">
              Edit
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ClientTable;
