import Link from "next/link";

function SideNavigation() {
  return (
    <nav className="col-span-3 row-span-8 row-start-4 bg-primary-800 text-primary-100 text-xl">
      <ul className="grid grid-cols-3 grid-rows-7 mt-8 h-2/4">
        <li className="col-span-3 flex items-center justify-center hover:bg-primary-900 w-full hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link href="/">Dashboard</Link>
        </li>
        <li className="col-span-3 row-start-2 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors gap-4 font-semibold text-primary-200 ">
          <Link href="/projects">Projects</Link>
        </li>
        <li className="col-span-3 row-start-3 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link href="/clients">Clients</Link>
        </li>
        <li className="col-span-3 row-start-6 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link href="/setting">Setting</Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
