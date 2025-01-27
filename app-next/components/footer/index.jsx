"use client";

import { useState, useTransition } from "react";
import { Github, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveContactMessage } from "@/action";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        await saveContactMessage(formData);
        setStatus({
          type: "success",
          message: "Thank you! We will get back to you as soon as possible.",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        setStatus({
          type: "error",
          message: "Something went wrong. Please try again later.",
        });
      }
    });
  };

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
            By accessing and using this website, you accept and agree to be
            bound by these Terms of Service and our Privacy Policy.
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
            respective owners. User-generated content remains the property of
            the user.
          </p>
          <h3 className="text-lg font-semibold text-blue-400">
            Service Modifications
          </h3>
          <p>
            We reserve the right to modify or discontinue the service at any
            time without notice. We are not liable for any modification,
            suspension, or discontinuation.
          </p>
        </div>
      ),
    },
    contact: {
      title: "Contact Us",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Get in Touch
            </h3>
            <p className="mb-4">
              Have questions or feedback? We'd love to hear from you. Fill out
              the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[120px]"
                placeholder="Your message..."
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Message"}
            </Button>

            {status && (
              <p
                className={`text-center mt-4 ${
                  status.type === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      ),
    },
  };

  return (
    <footer className="py-8 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2025 MovieApp. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveModal("terms")}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal("contact")}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Contact
            </button>
            <a
              href="https://github.com/l0rians/groupApp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {modals[activeModal].title}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 text-gray-300">
              {modals[activeModal].content}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
