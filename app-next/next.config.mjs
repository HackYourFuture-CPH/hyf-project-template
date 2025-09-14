/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow Unsplash, Picsum and common placeholder hosts plus local backend
    domains: [
      "images.unsplash.com",
      "picsum.photos",
      "placehold.co",
      "localhost",
      "127.0.0.1",
      "ufs.sh",
      "3ob6vy266n.ufs.sh",
    ],
  },
};

export default nextConfig;
