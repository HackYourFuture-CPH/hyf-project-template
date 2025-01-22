"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../../action";

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];

    if (!usernameCookie) {
      router.push("/login");
    } else {
      setUsername(usernameCookie);
    }
  }, [router]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleCloseForm = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex justify-center items-center relative">
      <button
        onClick={handleCloseForm}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow text-sm transition transform hover:scale-105"
      >
        Close
      </button>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex justify-center items-center bg-gray-900 rounded-full border-4 border-blue-500 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <span className="text-lg font-bold">Avatar</span>
                <span className="text-3xl font-bold mt-1">?</span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer shadow-lg hover:scale-110 transition transform">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span
                className="text-white font-bold text-lg relative -translate-y-1/2"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "16px",
                }}
              >
                +
              </span>
            </label>
          </div>
          <h1 className="mt-4 text-xl font-semibold">{username || "User"}</h1>
          <p className="text-gray-400 text-sm">Your personal profile</p>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            My List
          </button>
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            Account Details
          </button>
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            Rate Us
          </button>
        </div>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            Terms
          </button>
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            Privacy
          </button>
          <button className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm">
            Support
          </button>
        </div>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-md shadow text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
