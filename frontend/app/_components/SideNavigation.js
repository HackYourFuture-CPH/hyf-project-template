import Link from "next/link";

function SideNavigation() {
  return (
    <nav className="flex flex-col gap-16 justify-start align-middle bg-primary-800 text-primary-100 w-80 h-screen text-xl rounded-2xl">
      <ul className="">
        <li className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200">
          <Link href="/">Dashbord</Link>
        </li>
        <li className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200">
          <Link href="/projects">Projects</Link>
        </li>
        <li className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200">
          <Link href="/clients">Clients</Link>
        </li>
        <li className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200">
          <Link href="/setting">Setting</Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
