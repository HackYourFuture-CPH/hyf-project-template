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
    <div
      className="flex flex-col items-center 
    justify-evenly w-full px-4 md:px-10 lg:px-20"
    >
      <div className="flex justify-between items-center w-full py-6">
        <h1
          className={`${nabla.className} text-2xl md:text-4xl`}
        >
          WFlance
        </h1>

        <div className="flex justify-center items-center gap-4">
          <div className="flex">
            <UserIcon className="h-6 w-6 text-slate-50" />

            <span className="text-sm md:text-lg text-slate-50">
              {userName}
            </span>
          </div>
          <LogOutButton />
        </div>
      </div>

      <nav className=" w-full">
        <ul className="flex flex-wrap items-center justify-center gap-8 text-sm md:text-lg lg:text-xl font-semibold">
          <li className="hover:text-white hover:border-b-2 hover:border-lime-500 transition-colors ">
            <Link href="/client-dashboard">Dashboard</Link>
          </li>

          <li>
            <Link
              href="/client-dashboard/projects"
              className="hover:text-white hover:border-b-2 hover:border-lime-500 transition-colors"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/client-dashboard/calendar"
              className="hover:text-white hover:border-b-2 hover:border-lime-500 transition-colors"
            >
              Calendar
            </Link>
          </li>

          <li>
            <Link
              href="/client-dashboard/chat"
              className="hover:text-white hover:border-b-2 hover:border-lime-500 transition-colors"
            >
              Chat
            </Link>
          </li>
          <li>
            <Link href="/client-dashboard/createProject">
              <button className="bg-accent-500  px-6 py-2 md:px-8 md:py-4 text-primary-800 font-semibold hover:bg-amber-300 transition-all rounded-lg cursor-pointer">
                Create project
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NewNavigation;
