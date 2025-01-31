import React from "react";
import { useRouter } from "next/navigation";

export default function ComingSoon() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-white relative p-6">
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
      >
        Close
      </button>
      <div className="text-center p-10 bg-gradient-to-b from-gray-900 to-blue-900 rounded-3xl shadow-2xl border border-blue-700/50 backdrop-blur-md">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-300 drop-shadow-lg">
          Coming Soon
        </h1>
        <p className="text-lg text-blue-200 mb-6 max-w-lg">
          This feature is under development and will be available soon. Stay
          tuned!
        </p>
      </div>
    </div>
  );
}
