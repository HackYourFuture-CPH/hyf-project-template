/*"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserProfile, updateProfile } from "@/action";

export default function EditProfile({ onClose, updateAvatar }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [userId, setUserId] = useState(null);

  const avatars = [
    { id: 1, src: "/images/avatar7.png" },
    { id: 2, src: "/images/avatar8.png" },
    { id: 3, src: "/images/avatar9.png" },
    { id: 4, src: "/images/avatar4.png" },
    { id: 5, src: "/images/avatar5.png" },
    { id: 6, src: "/images/avatar6.png" },
  ];

  useEffect(() => {
    const username = Cookies.get("username");
    const userIdFromCookie = Cookies.get("userId");

    if (username) {
      setName(username);
    }
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      fetchUserProfile(userIdFromCookie);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        console.log("Fetched user profile:", profile);

        setName(profile.username || "");

        setDob(profile.dob || "");

        if (profile.avatarUrl) {
          const avatar = avatars.find((a) => a.src === profile.avatarUrl);
          if (avatar) {
            setSelectedAvatar(avatar.id);
          } else {
            setCustomAvatar(profile.avatarUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomAvatar(reader.result);
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (id) => {
    setSelectedAvatar(id);
    setCustomAvatar(null);
  };

  const handleSave = async () => {
    const avatarUrl =
      customAvatar ||
      avatars.find((avatar) => avatar.id === selectedAvatar)?.src;

    try {
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const result = await updateProfile(userId, dob, avatarUrl);

      if (result.success) {
        alert("Profile saved successfully!");
        if (avatarUrl) {
          updateAvatar(avatarUrl);
        }
        onClose();
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-75 fixed inset-0">
      <div className="relative w-full max-w-md bg-[#1e1e2e] rounded-2xl shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow"
        >
          ✕
        </button>

        <h1 className="text-white text-xl font-semibold mb-6 text-center">
          Edit Profile
        </h1>

        <div className="flex justify-center items-center mb-6 relative">
          <div className="relative w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-[#2a2a3c]">
            {customAvatar ? (
              <img
                src={customAvatar}
                alt="Custom Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : selectedAvatar ? (
              <img
                src={
                  avatars.find((avatar) => avatar.id === selectedAvatar)?.src
                }
                alt="Selected Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-white text-center">
                <p>Avatar</p>
                <p>?</p>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomAvatarUpload}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-2 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarClick(avatar.id)}
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

        <div className="mb-4">
          <label className="text-gray-400 block mb-1">Name</label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-full bg-[#2a2a3c] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 block mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-[#2a2a3c] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            customAvatar || selectedAvatar || dob
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!dob && !customAvatar && !selectedAvatar}
        >
          Save
        </button>
      </div>
    </div>
  );
}*/
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserProfile, updateProfile } from "@/action";
import { UploadButton } from "@uploadthing/react";

export default function EditProfile({ onClose, updateAvatar }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [userId, setUserId] = useState(null);

  const avatars = [
    { id: 1, src: "/images/avatar7.png" },
    { id: 2, src: "/images/avatar8.png" },
    { id: 3, src: "/images/avatar9.png" },
    { id: 4, src: "/images/avatar4.png" },
    { id: 5, src: "/images/avatar5.png" },
    { id: 6, src: "/images/avatar6.png" },
  ];

  useEffect(() => {
    const username = Cookies.get("username");
    const userIdFromCookie = Cookies.get("userId");

    if (username) {
      setName(username);
    }
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      fetchUserProfile(userIdFromCookie);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setName(profile.username || "");
        setDob(profile.dob || "");

        if (profile.avatarUrl) {
          // Make sure avatars is an array before calling .find()
          const avatar = Array.isArray(avatars)
            ? avatars.find((a) => a.src === profile.avatarUrl)
            : null;
          if (avatar) {
            setSelectedAvatar(avatar.id);
          } else {
            setCustomAvatar(profile.avatarUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Failed to load profile. Please try again.");
    }
  };

  const handleCustomAvatarUpload = async (url) => {
    setCustomAvatar(url);
    setSelectedAvatar(null);
  };

  const handleAvatarClick = (id) => {
    setSelectedAvatar(id);
    setCustomAvatar(null);
  };

  const handleSave = async () => {
    const avatarUrl =
      customAvatar ||
      avatars.find((avatar) => avatar.id === selectedAvatar)?.src;

    try {
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      const result = await updateProfile(userId, dob, avatarUrl);

      if (result.success) {
        alert("Profile saved successfully!");
        if (avatarUrl) {
          updateAvatar(avatarUrl);
          Cookies.set("avatar", avatarUrl, { expires: 7 }); // Update cookies
        }
        onClose();
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-75 fixed inset-0">
      <div className="relative w-full max-w-md bg-[#1e1e2e] rounded-2xl shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow"
        >
          ✕
        </button>

        <h1 className="text-white text-xl font-semibold mb-6 text-center">
          Edit Profile
        </h1>

        <div className="flex justify-center items-center mb-6 relative">
          <div className="relative w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-[#2a2a3c]">
            {customAvatar ? (
              <img
                src={customAvatar}
                alt="Custom Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : selectedAvatar ? (
              <img
                src={
                  avatars.find((avatar) => avatar.id === selectedAvatar)?.src
                }
                alt="Selected Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-white text-center">
                <p>Avatar</p>
                <p>?</p>
              </div>
            )}

            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Upload Response:", res);

                if (Array.isArray(res) && res.length > 0) {
                  const uploadedFile = res[0];
                  handleCustomAvatarUpload(uploadedFile.url);
                } else {
                  console.error("Invalid response from UploadThing:", res);
                }
              }}
              onUploadError={(error) => {
                console.error("Upload failed:", error);
                alert("Image upload failed.");
              }}
            />
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-2 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarClick(avatar.id)}
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

        <div className="mb-4">
          <label className="text-gray-400 block mb-1">Name</label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-full bg-[#2a2a3c] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 block mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-[#2a2a3c] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            dob || customAvatar || selectedAvatar
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!dob && !customAvatar && !selectedAvatar}
        >
          Save
        </button>
      </div>
    </div>
  );
}
