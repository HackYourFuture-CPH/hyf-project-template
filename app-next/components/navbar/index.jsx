/*"use client";

import { PlayCircle, ArrowUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const pathname = usePathname();

  // Чтение cookies на клиенте
  useEffect(() => {
    console.log("Checking cookies..."); // Сообщение перед началом чтения cookies
    const cookies = document.cookie.split("; ");
    console.log("All cookies:", cookies); // Вывод всех cookies
    const usernameCookie = cookies.find((row) => row.startsWith("username="));
    console.log("Found username cookie:", usernameCookie); // Показываем, нашлась ли cookie
    if (usernameCookie) {
      const value = usernameCookie.split("=")[1];
      console.log("Username value:", value); // Показываем значение username
      setUsername(value);
    }
  }, []);

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
            <span className="text-gray-300">Hi, {username}</span>
          ) : (
            <>
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
}*/

"use client";

import { PlayCircle, ArrowUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const pathname = usePathname();

  // Чтение cookies на клиенте
  useEffect(() => {
    console.log("Checking cookies..."); // Сообщение перед началом чтения cookies
    const cookies = document.cookie.split("; ");
    console.log("All cookies:", cookies); // Вывод всех cookies
    const usernameCookie = cookies.find((row) => row.startsWith("username="));
    console.log("Found username cookie:", usernameCookie); // Показываем, нашлась ли cookie
    if (usernameCookie) {
      const value = usernameCookie.split("=")[1];
      console.log("Username value:", value); // Показываем значение username
      setUsername(value);
    }
  }, []);

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
            <div className="flex items-center bg-blue-100 text-blue-500 font-medium text-lg px-4 py-2 rounded-lg shadow-sm">
              <User className="w-5 h-5 mr-2" />
              Hi, {username}
            </div>
          ) : (
            <>
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

