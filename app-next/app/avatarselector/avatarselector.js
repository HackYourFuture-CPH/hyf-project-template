"use client";

export default function AvatarSelector({ avatars, selectedAvatar, onSelect }) {
  return (
    <div className="flex overflow-x-auto space-x-4 pb-2 mb-6">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.id)}
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
  );
}
