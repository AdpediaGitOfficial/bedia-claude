/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "yourcdn.com",
      },
      {
        protocol: "https",
        hostname: "youtube.com",
      },
    ],
  },
}

module.exports = nextConfig



