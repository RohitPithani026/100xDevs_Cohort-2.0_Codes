/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.backpack.exchange/api/v1/:path*", // Proxy to external API
      },
    ];
  },
};

export default nextConfig;
