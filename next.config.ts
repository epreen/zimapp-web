import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

if (process.env.NODE_ENV !== "production") {
  import("./scripts/ngrok.js")
    .then(({ startNgrok }) => startNgrok())
    .catch((error) => {
      console.error("Failed to start ngrok tunnel:", error);
    });
}

export default nextConfig;
