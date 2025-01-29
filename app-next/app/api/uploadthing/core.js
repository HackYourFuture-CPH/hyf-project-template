const { createUploadthing } = require("uploadthing/next");

const f = createUploadthing();

const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for user:", metadata.userId);
    console.log("Uploaded file URL:", file.url);
  }),
};

module.exports = { ourFileRouter };
