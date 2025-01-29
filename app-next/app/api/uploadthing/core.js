/*import { createUploadthing } from "uploadthing/server";

console.log("UploadThing File Router initialized");

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    console.log("✅ File uploaded:", file);
    return { url: file.url };
  }),
};*/
const { createUploadthing } = require("uploadthing/server");

const f = createUploadthing();

const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    ({ file }) => {
      console.log("✅ File uploaded:", file.url);
    }
  ),
};

module.exports = { ourFileRouter };
