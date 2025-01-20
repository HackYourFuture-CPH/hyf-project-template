"use client";

import React, { useState } from "react";
import male1 from "@/image/avatars/male1.png";
import male2 from "@/image/avatars/male2.png";
import male3 from "@/image/avatars/male3.png";
import female1 from "@/image/avatars/female1.png";
import female2 from "@/image/avatars/female2.png";
import female3 from "@/image/avatars/female3.png";

const avatars = {
  male: [male1, male2, male3],
  female: [female1, female2, female3],
};

export default function Profile() {
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [gender, setGender] = useState("male");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-900 text-white flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="w-24 h-24 mb-4">
        {selectedAvatar ? (
          <img
            src={selectedAvatar.src}
            alt="Selected Avatar"
            className="rounded-full w-full h-full object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No Avatar</span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Choose your gender:</label>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {avatars[gender].map((avatar, index) => (
          <button
            key={index}
            onClick={() => setSelectedAvatar(avatar)}
            className={`p-2 rounded-lg ${
              selectedAvatar === avatar
                ? "border-4 border-blue-500"
                : "border border-gray-600"
            }`}
          >
            <img
              src={avatar.src}
              alt={`Avatar ${index + 1}`}
              className="rounded-full w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          document.cookie = `avatar=${selectedAvatar.src}; path=/;`;
          alert("Profile saved!");
        }}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
      >
        Save Profile
      </button>
    </div>
  );
}
