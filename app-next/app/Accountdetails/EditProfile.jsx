"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserProfile, updateProfile } from "@/action";
import { UploadButton } from "@/utils/uploadthing";

export default function EditProfile({ onClose, updateAvatar }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const avatars = [
    { id: 1, src: "/images/avatar7.png" },
    { id: 2, src: "/images/avatar8.png" },
    { id: 3, src: "/images/avatar9.png" },
    { id: 4, src: "/images/avatar4.png" },
    { id: 5, src: "/images/avatar5.png" },
    { id: 6, src: "/images/avatar6.png" },
    { id: 7, src: "/images/avatar3.png" },
    { id: 8, src: "/images/avatar2.png" },
    { id: 9, src: "/images/avatar1.png" },
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
      alert("Failed to load profile. Please try again.");
    }
  };

  const handleAvatarClick = (id) => {
    setSelectedAvatar(id);
    setCustomAvatar(null);
  };

  const handleCustomAvatarUpload = (url) => {
    setCustomAvatar(url);
    setSelectedAvatar(null);
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
          Cookies.set("avatar", avatarUrl, { expires: 7 });
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
          </div>
        </div>

        <UploadButton
          endpoint="imageUploader"
          onUploadStart={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              handleCustomAvatarUpload(res[0].url);
            }
            setIsUploading(false);
          }}
          onUploadError={(error) => {
            console.error("upload error:", error);
            setIsUploading(false);
          }}
        >
          {({ open }) => (
            <button
              onClick={open}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg transition-transform transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5v-9m0 0L9.75 8.25M12 7.5l2.25 1.5M21 21H3M16.5 3h-9a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0016.5 3z"
                />
              </svg>
              <span>Upload Avatar</span>
            </button>
          )}
        </UploadButton>

        {isUploading && (
          <p className="text-blue-500 text-center mt-4">Uploading...</p>
        )}

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
