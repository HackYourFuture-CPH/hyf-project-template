"use client";

import { useEffect, useState } from "react";
import LogOutButton from "../AuthComponents/LogOutButton";
import NewNavigation from "./NewNavigation";

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
    <header className="w-full h-[13rem] bg-primary-600 text-slate-50 shadow-md">
      <NewNavigation userName={userName} />
    </header>
  );
}

export default Header;
