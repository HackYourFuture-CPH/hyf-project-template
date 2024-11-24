import Image from "next/image";
import Link from "next/link";
import bg from "@/public/dashboard-design.jpg";

export default function ClientDashboard() {
  return (
    <div className="relative w-full h-full min-h-100vh">
      <Image
        src={bg}
        fill
        quality={80}
        placeholder="blur"
        alt="dashboard-design"
        className="object-cover object-top min-h-screen"
      />
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-8xl text-emerald-200 mb-20 tracking-tight font-normal">
          Welcome to your dashboard.
        </h1>
        <Link
          href="client-dashboard/projects"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore your Project
        </Link>
      </div>
    </div>
  );
}
