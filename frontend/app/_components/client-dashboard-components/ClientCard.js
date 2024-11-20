// import { UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

function ClientCard({ project }) {
  // const { id, name, email, phone, createdAt, image } =
  //   client;

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1 w-64 border-primary-800 border">
      <div className="relative aspect-square col-span-3 row-span-3 col-start-2">
        <img
          src="https://i.pravatar.cc/48?u=118836"
          alt={`clientName `}
          className=" border-r object-cover my-1 w-full rounded-full"
        />
        {/* <Image
          src="https://i.pravatar.cc/48?u=118836"
          alt={`clientName `}
          fill
          className=" border-r my-1 w-full rounded-full object-cover"
        /> */}
      </div>
      <h3 className="col-span-5 row-start-4 flex justify-center items-center text-accent-500 font-semibold text-2xl  bg-primary-50">
        {project.title}
      </h3>
    </div>
  );
}

export default ClientCard;
