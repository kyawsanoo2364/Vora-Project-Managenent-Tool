import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: "100mb", // HERE → increase limit
  },
};

export default nextConfig;
