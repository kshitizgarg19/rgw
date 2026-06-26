import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All imagery is served locally from /public — no remote hosts needed.
  // (Next 16: images.domains is deprecated; remotePatterns would go here if used.)
  images: {
    qualities: [50, 70, 80, 90, 100],
    formats: ["image/avif", "image/webp"],
  },
  // Keep server-only packages out of the client bundle / Turbopack tracing.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
