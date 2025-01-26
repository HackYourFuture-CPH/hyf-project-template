"use client";

import { PlayCircle, User, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const usernameCookie = cookies.find((row) => row.startsWith("username="));
    if (usernameCookie) {
      const value = usernameCookie.split("=")[1];
      setUsername(decodeURIComponent(value));
    }
  }, []);

  const goToProfile = () => {
    router.push("/profile");
  };

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
          {username ? (
            <div
              onClick={goToProfile}
              className="flex items-center bg-blue-100 text-blue-500 font-medium text-lg px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-200"
            >
              <User className="w-5 h-5 mr-2" />
              Hi, {username}
            </div>
          ) : (
            <>
              <Link href="/room">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-blue-400"
                >
                  Create Room
                </Button>
              </Link>
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
            </>
          )}
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
