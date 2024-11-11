import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href=""
            className="hover:text-accent-400 transition-colors"
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            href=""
            className="hover:text-accent-400 transition-colors"
          >
            Timeline
          </Link>
        </li>
        <li>
          <Link
            href=""
            className="hover:text-accent-400 transition-colors"
          >
            Invoicing
          </Link>
        </li>
        <li>
          <Link
            href=""
            className="hover:text-accent-400 transition-colors"
          >
            Budget
          </Link>
        </li>
        <li>
          <Link
            href=""
            className="hover:text-accent-400 transition-colors"
          >
            Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
}
