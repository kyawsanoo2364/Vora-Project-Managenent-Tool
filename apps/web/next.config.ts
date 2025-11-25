import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "**",
        protocol: "https",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: "100mb", // HERE → increase limit
  },
};

export default nextConfig;
