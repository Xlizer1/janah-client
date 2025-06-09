import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "aljanah.store",
      "www.aljanah.store",
      "localhost", // for development
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://aljanah.store/api/v1",
  },
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};

export default nextConfig;
