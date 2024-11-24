import { Nabla } from "next/font/google";
import Link from "next/link";
import LogOutButton from "../AuthComponents/LogOutButton";

import { UserIcon } from "@heroicons/react/24/solid";

const nabla = Nabla({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

function NewNavigation({ userName }) {
  return (
    <div className="flex flex-col items-center mx-3">
      <div className="flex justify-between items-center min-w-full">
        <div className="py-11">
          <h1 className={`${nabla.className} text-5xl `}>
            WFlance
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex">
            <UserIcon className="h-6 w-6 text-gray-500" />

            <span>{userName}</span>
          </div>
          <LogOutButton />
        </div>
      </div>

      <nav className="flex items-center justify-around space-x-6 text-lg text-primary-800 w-full">
        <ul className="flex gap-16 items-center font-semibold">
          <li className="hover:text-accent-400 hover:border-b-4 hover:border-lime-500 transition-colors ">
            <Link href="/client-dashboard">Dashboard</Link>
          </li>

          <li>
            <Link
              href="/client-dashboard/projects"
              className="hover:text-accent-400 hover:border-b-4 hover:border-lime-500 transition-colors"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/client-dashboard/calendar"
              className="hover:text-accent-400 hover:border-b-4 hover:border-lime-500 transition-colors"
            >
              Calendar
            </Link>
          </li>

          <li>
            <Link
              href=""
              className="hover:text-accent-400 hover:border-b-4 hover:border-lime-500 transition-colors"
            >
              Chat
            </Link>
          </li>
        </ul>
        <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
          Create project
        </button>
      </nav>
    </div>
  );
}

export default NewNavigation;
