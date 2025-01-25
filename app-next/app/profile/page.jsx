"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaStar,
  FaListAlt,
  FaUserAlt,
  FaLanguage,
  FaCog,
  FaFileAlt,
} from "react-icons/fa";
import { logout, getUserProfile, updateProfile } from "@/action";
import RateUs from "../rateus/RateUs";
import EditProfile from "@/app/Accountdetails/EditProfile";

const avatars = [
  { id: 1, src: "/images/avatar7.png" },
  { id: 2, src: "/images/avatar8.png" },
  { id: 3, src: "/images/avatar9.png" },
  { id: 4, src: "/images/avatar4.png" },
  { id: 5, src: "/images/avatar5.png" },
  { id: 6, src: "/images/avatar6.png" },
];

const modalContent = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">
          Data Collection and Usage
        </h3>
        <p>
          We collect minimal personal information necessary to provide our
          services. This includes:
        </p>
        <ul className="list-disc pl-4">
          <li>Favorites list preferences</li>
          <li>Basic usage statistics</li>
          <li>Browser information</li>
        </ul>
        <h3 className="text-lg font-semibold text-blue-400">Cookies</h3>
        <p>
          We use cookies to enhance your browsing experience and remember your
          preferences. You can control cookie settings through your browser
          preferences.
        </p>
        <h3 className="text-lg font-semibold text-blue-400">
          Third-Party Services
        </h3>
        <p>
          We use The Movie Database (TMDB) API for movie information. Their
          privacy policy applies to data received from their services.
        </p>
        <h3 className="text-lg font-semibold text-blue-400">Data Security</h3>
        <p>
          We implement security measures to protect your information. However,
          no internet transmission is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">
          Acceptance of Terms
        </h3>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by these Terms of Service and our Privacy Policy.
        </p>
        <h3 className="text-lg font-semibold text-blue-400">
          User Responsibilities
        </h3>
        <p>Users agree to:</p>
        <ul className="list-disc pl-4">
          <li>Provide accurate information</li>
          <li>Use the service for lawful purposes</li>
          <li>Not attempt to breach security measures</li>
          <li>Respect intellectual property rights</li>
        </ul>
        <h3 className="text-lg font-semibold text-blue-400">
          Content and Copyright
        </h3>
        <p>
          Movie information is provided by TMDB. All rights belong to their
          respective owners. User-generated content remains the property of the
          user.
        </p>
        <h3 className="text-lg font-semibold text-blue-400">
          Service Modifications
        </h3>
        <p>
          We reserve the right to modify or discontinue the service at any time
          without notice. We are not liable for any modification, suspension, or
          discontinuation.
        </p>
      </div>
    ),
  },
  support: {
    title: "Support",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">Contact Support</h3>
        <p>
          If you need assistance, click the button below to send us an email.
        </p>
        <a
          href="mailto:movieapp@gmail.com?subject=Support%20Request"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md block text-center"
        >
          Send Email
        </a>
      </div>
    ),
  },
};

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null); 
  const [modal, setModal] = useState(null);
  const [showRateUs, setShowRateUs] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMyList, setShowMyList] = useState(false); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userIdFromCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId="))
          ?.split("=")[1];

        if (userIdFromCookie) {
          const profile = await getUserProfile(userIdFromCookie);
          setUsername(profile.username);
          setAvatar(profile.avatarUrl);
          setSelectedAvatar(
            avatars.find((a) => a.src === profile.avatarUrl)?.id || null
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarSelect = async (id) => {
    const avatarUrl = avatars.find((avatar) => avatar.id === id)?.src;
    setSelectedAvatar(id);
    setAvatar(avatarUrl);

    try {
      const userIdFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1];

      if (userIdFromCookie) {
        await updateProfile(userIdFromCookie, null, avatarUrl);
        console.log("Avatar updated successfully");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex justify-center items-center relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow text-sm transition transform hover:scale-105"
      >
        Close
      </button>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex justify-center items-center bg-gray-900 rounded-full border-4 border-blue-500 overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <span className="text-lg font-bold">Avatar</span>
                <span className="text-3xl font-bold mt-1">?</span>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-xl font-semibold">{username || "User"}</h1>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-2 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar.id)}
              className={`relative w-16 h-16 rounded-full flex-shrink-0 p-1 border-2 ${
                selectedAvatar === avatar.id
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => setShowMyList(true)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaListAlt className="mr-3" /> My List
            </div>
            <FaArrowRight />
          </button>
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaUserAlt className="mr-3" /> Account Details
            </div>
            <FaArrowRight />
          </button>
          <button
            onClick={() => setShowRateUs(true)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaStar className="mr-3" /> Rate Us
            </div>
            <FaArrowRight />
          </button>
        </div>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="space-y-3">
          {Object.keys(modalContent).map((key) => (
            <button
              key={key}
              onClick={() => setModal(modalContent[key])}
              className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
            >
              <div className="flex items-center">
                {key === "terms" && <FaFileAlt className="mr-3" />}
                {key === "privacy" && <FaCog className="mr-3" />}
                {key === "support" && <FaLanguage className="mr-3" />}
                {modalContent[key].title}
              </div>
              <FaArrowRight />
            </button>
          ))}
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

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{modal.title}</h2>
            {modal.content}
            <button
              onClick={() => setModal(null)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showRateUs && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <RateUs onClose={() => setShowRateUs(false)} />
        </div>
      )}

      {showMyList && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">My List</h2>
            <p>Your favorite movies will appear here.</p>
            <button
              onClick={() => setShowMyList(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 bg-gradient-to-b from-black to-blue-900 flex items-center justify-center">
          <EditProfile
            onClose={() => setShowEditProfile(false)}
            updateAvatar={(newAvatar) => {
              setAvatar(newAvatar);
              setSelectedAvatar(
                avatars.find((avatar) => avatar.src === newAvatar)?.id || null
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
