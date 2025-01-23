/*"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../../action";

const modals = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">
          Data Collection and Usage
        </h3>
        <p>
          We collect minimal personal information necessary to provide our
          services. This includes: - Favorites list preferences - Basic usage
          statistics - Browser information
        </p>

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
        <p>
          Users agree to: - Provide accurate information - Use the service for
          lawful purposes - Not attempt to breach security measures - Respect
          intellectual property rights
        </p>

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
  const [modal, setModal] = useState(null);

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
          <button
            onClick={() => setModal(modals.terms)}
            className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm"
          >
            Terms
          </button>
          <button
            onClick={() => setModal(modals.privacy)}
            className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm"
          >
            Privacy
          </button>
          <button
            onClick={() => setModal(modals.support)}
            className="w-full flex items-center justify-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg shadow text-sm"
          >
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

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{modal.title}</h2>
            {modal.content}
            <button
              onClick={() => setModal(null)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}*/"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../../action";
import { FaArrowRight, FaStar, FaListAlt, FaUserAlt, FaLanguage, FaCog, FaFileAlt } from "react-icons/fa";

const modals = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">Data Collection and Usage</h3>
        <p>
          We collect minimal personal information necessary to provide our services. This includes:
          - Favorites list preferences
          - Basic usage statistics
          - Browser information
        </p>

        <h3 className="text-lg font-semibold text-blue-400">Cookies</h3>
        <p>
          We use cookies to enhance your browsing experience and remember your preferences. You can control cookie settings through your browser preferences.
        </p>

        <h3 className="text-lg font-semibold text-blue-400">Third-Party Services</h3>
        <p>
          We use The Movie Database (TMDB) API for movie information. Their privacy policy applies to data received from their services.
        </p>

        <h3 className="text-lg font-semibold text-blue-400">Data Security</h3>
        <p>
          We implement security measures to protect your information. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">Acceptance of Terms</h3>
        <p>
          By accessing and using this website, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
        </p>

        <h3 className="text-lg font-semibold text-blue-400">User Responsibilities</h3>
        <p>
          Users agree to:
          - Provide accurate information
          - Use the service for lawful purposes
          - Not attempt to breach security measures
          - Respect intellectual property rights
        </p>

        <h3 className="text-lg font-semibold text-blue-400">Content and Copyright</h3>
        <p>
          Movie information is provided by TMDB. All rights belong to their respective owners. User-generated content remains the property of the user.
        </p>

        <h3 className="text-lg font-semibold text-blue-400">Service Modifications</h3>
        <p>
          We reserve the right to modify or discontinue the service at any time without notice. We are not liable for any modification, suspension, or discontinuation.
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
  const [modal, setModal] = useState(null);

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
          <button className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm">
            <div className="flex items-center">
              <FaListAlt className="mr-3" /> My List
            </div>
            <FaArrowRight />
          </button>
          <button className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm">
            <div className="flex items-center">
              <FaUserAlt className="mr-3" /> Account Details
            </div>
            <FaArrowRight />
          </button>
          <button className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm">
            <div className="flex items-center">
              <FaStar className="mr-3" /> Rate Us
            </div>
            <FaArrowRight />
          </button>
        </div>

        <div className="my-4 border-t border-gray-600"></div>

        <div className="space-y-3">
          <button
            onClick={() => setModal(modals.terms)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaFileAlt className="mr-3" /> Terms
            </div>
            <FaArrowRight />
          </button>
          <button
            onClick={() => setModal(modals.privacy)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaCog className="mr-3" /> Privacy
            </div>
            <FaArrowRight />
          </button>
          <button
            onClick={() => setModal(modals.support)}
            className="w-full flex items-center justify-between py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow text-sm"
          >
            <div className="flex items-center">
              <FaLanguage className="mr-3" /> Support
            </div>
            <FaArrowRight />
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

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-white\">{modal.title}</h2>
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
    </div>
  );
}

