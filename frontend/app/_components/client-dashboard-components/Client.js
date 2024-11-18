function Client({ client }) {
  return (
    <li className="grid grid-cols-[4.8rem_1fr_auto] items-center gap-x-4 p-3 rounded-md transition-all bg-primary-50 duration-500">
      <img
        src={client.image}
        alt={client.name}
        className="rounded-full w-full row-span-2"
      />
      <h2 className="text-lg">{client.name}</h2>
      <p className="text-accent-400">
        {client.phoneNumber}
      </p>
      <p className="text-accent-600">
        {client.phoneNumber}
      </p>
      <p className="text-accent-500">
        {client.phoneNumber}
      </p>
    </li>
  );
}

export default Client;
