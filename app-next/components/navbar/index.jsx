"use client";

import { PlayCircle, ArrowUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";



export default function Navbar() {
  const pathname = usePathname();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <header className="py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/">
            <PlayCircle className="h-8 w-8 text-blue-500" />
          </Link>

          <h1 className="text-2xl font-bold text-blue-500">MovieApp</h1>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-blue-400"
            >
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>
      {pathname === "/movies" && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
