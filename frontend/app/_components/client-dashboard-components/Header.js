"use client";

import { useEffect, useState } from "react";
import LogOutButton from "../AuthComponents/LogOutButton";
import Logo from "./Logo";
import Navigation from "./Navigation";

function Header() {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setUserName(userData?.name || "Guest");
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <header className="col-span-12 row-span-2 flex flex-col bg-primary-300 border-b border-primary-900 h-[20rem]">
      <div className="flex justify-around items-center bg-primary-500 h-20 py-3">
        <Logo />
        <h1 className="text-2xl text-primary-100">
          Client Management
        </h1>
        <LogOutButton />
      </div>
      <div className="flex justify-between items-end text-primary-800 text-3xl px-10 h-40">
        <p>Welcome {userName}</p>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
