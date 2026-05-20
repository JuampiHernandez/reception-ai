import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo/smilecare",
        destination: "/smilecare",
        permanent: true,
      },
      {
        source: "/demo/smilecare/:path*",
        destination: "/smilecare/:path*",
        permanent: true,
      },
      {
        source: "/demo/:tenant",
        destination: "/:tenant",
        permanent: true,
      },
      {
        source: "/demo/:tenant/:path*",
        destination: "/:tenant/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
