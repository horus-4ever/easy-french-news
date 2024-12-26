export {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Ensure the app router is enabled
  },
  images: {remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
}
};

module.exports = nextConfig;
