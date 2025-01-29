import { createUploadthing, createNextRouteHandler } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    ({ file }) => {
      console.log("✅ File uploaded:", file.url);
    }
  ),
};


export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
