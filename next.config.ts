import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

if (process.env.NODE_ENV !== "production") {
  import("./scripts/ngrok.js")
    .then(({ startNgrok }) => startNgrok())
    .catch((error) => {
      console.error("Failed to start ngrok tunnel:", error);
    });
}

export default nextConfig;
