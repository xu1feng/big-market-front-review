import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        API_HOST_URL: process.env.API_HOST_URL
    }
};

export default nextConfig;
