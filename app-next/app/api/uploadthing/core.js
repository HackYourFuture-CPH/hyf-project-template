import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    console.log("✅ file uploaded:", file);
    return { url: file.url };
  }),
};
