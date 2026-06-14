import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const uploadRemotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "data.digicraft.one",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "mvilab.in",
    pathname: "/uploads/**",
  },
  {
    protocol: "https",
    hostname: "www.mvilab.in",
    pathname: "/uploads/**",
  },
];

const appUrl = process.env.APP_URL?.trim();
if (appUrl) {
  try {
    const parsed = new URL(appUrl);
    const protocol = parsed.protocol.replace(":", "") as "http" | "https";
    const alreadyListed = uploadRemotePatterns.some(
      (pattern) => pattern.hostname === parsed.hostname && pattern.protocol === protocol,
    );

    if (!alreadyListed) {
      uploadRemotePatterns.push({
        protocol,
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
        pathname: "/uploads/**",
      });
    }
  } catch {
    // ignore invalid APP_URL
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: uploadRemotePatterns,
  },
};

export default nextConfig;
