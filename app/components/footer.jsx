import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
      </div>
      <footer className="absolute bottom-0 w-full h-10 bg-gray-100 text-black py-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm">
          &copy; {new Date().getUTCFullYear()} CodeCrafters Inc. | Privatlivspolitik | Copyright
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;