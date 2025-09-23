import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: ["http://192.168.56.1:3000", "http://10.13.145.27:3000"], // add your dev origin(s) here
};

export default nextConfig;
