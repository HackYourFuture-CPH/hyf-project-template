import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2024 GroupApp. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}