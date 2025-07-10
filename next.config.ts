import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını görmezden gel
  },
  typescript: {
    ignoreBuildErrors: true, // SADECE GEÇİCİ ÇÖZÜM
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
