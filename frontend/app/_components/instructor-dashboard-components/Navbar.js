"use client";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deepOrange, green } from "@mui/material/colors";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            credentials: "include",
          }
        );
        if (apiResponse.ok) {
          const userInfo = await apiResponse.json();
          setUserName(userInfo.name);
        } else {
          console.error("Error fetching user info");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUsers();
  }, []);
  return (
    <header className="w-full h-[4rem] bg-black shadow-md">
      <div className="flex justify-end mt-1 py-1">
        {userName && (
          <Avatar sx={{ bgcolor: deepOrange[400] }}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </div>
    </header>
  );
};

export default Navbar;
