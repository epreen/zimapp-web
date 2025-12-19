import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

if (process.env.NODE_ENV !== "production") {
  import("./scripts/ngrok.js").then(({ startNgrok }) => {
    startNgrok();
  });
}

export default nextConfig;
