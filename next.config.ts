import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.yts.mx" },
      { protocol: "https", hostname: "yts.mx" },
      { protocol: "https", hostname: "**.t.me" },
    ],
  },
};

export default nextConfig;
