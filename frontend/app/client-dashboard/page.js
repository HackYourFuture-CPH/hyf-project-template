import Link from "next/link";

export default function ClientDashboard() {
  return (
    <main className="mt-24">
      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          Welcome to your dashbord.
        </h1>
        <Link
          href="client-dashboard/projects"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore your Project
        </Link>
      </div>
    </main>
  );
}
