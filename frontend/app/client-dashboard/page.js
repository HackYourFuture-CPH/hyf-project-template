import Image from "next/image";
import Link from "next/link";
import bg from "@/public/dashboard-design.jpg";

export default function ClientDashboard() {
  return (
    <div className="relative w-full h-full min-h-100vh  text-base">
      <Image
        src={bg}
        fill
        quality={80}
        placeholder="blur"
        alt="dashboard-design"
        className="object-cover object-top min-h-screen"
      />
      <div
        className="relative z-10 flex flex-col items-center justify-center
       h-full text-center px-4 py-10 gap-96"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-emerald-200 mb-10 sm:mb-12 md:mb-16 lg:mb-20 tracking-tight font-normal">
          Welcome to Your Command Center – Let's Get
          Started!
        </h1>
        <Link
          href="client-dashboard/projects"
          className="bg-accent-500 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 text-base sm:text-lg md:text-xl lg:text-2xl text-primary-800 font-semibold
           hover:bg-yellow-300 transition-all rounded-lg shadow-lg"
        >
          Explore your Project
        </Link>
      </div>
    </div>
  );
}
