import Client from "./Client";

const clients = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    phoneNumber: 444444444,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    phoneNumber: 444444444,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    phoneNumber: 444444444,
  },
];

function ClientList() {
  return (
    <ul className="flex flex-col gap-1  mb-8 text-lg">
      {clients.map((client, idx) => (
        <Client
          client={client}
          // onSelectFriend={}
          // selectedFriend={}
          key={idx}
        />
      ))}
    </ul>
  );
}

export default ClientList;
