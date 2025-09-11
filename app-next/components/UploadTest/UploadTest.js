"use client";

import { UploadButton } from "@uploadthing/react";
import { useState } from "react";

export function UploadTest() {
  const [lastUploadedUrl, setLastUploadedUrl] = useState(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          UploadThing Test Page
        </h1>
        <p className="text-gray-600 mt-2">
          This is a standalone page for testing the secure image upload process.
        </p>
      </div>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const imageUrl = res[0].url;
            setLastUploadedUrl(imageUrl);
            alert("Upload Completed! Check the console for the file URL.");
          }
        }}
        onUploadError={(error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />

      {lastUploadedUrl && (
        <div className="text-center p-6 bg-green-100 border border-green-300 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800">
            Last Upload Successful!
          </h2>
          <p className="text-green-700 mt-2">Image URL:</p>
          <a
            href={lastUploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {lastUploadedUrl}
          </a>
          <div className="mt-4">
            <img
              src={lastUploadedUrl}
              alt="Uploaded image"
              className="max-w-xs rounded-md shadow-lg mx-auto"
            />
          </div>
        </div>
      )}
    </main>
  );
}
