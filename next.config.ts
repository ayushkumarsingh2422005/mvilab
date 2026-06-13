import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.digicraft.one',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
