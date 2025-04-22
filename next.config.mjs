/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Keep unoptimized if you don't want Next.js to optimize images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**", // Allow all paths under this domain
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@smithy", "util-stream"],
  },
  sassOptions: {
    includePaths: ["./styles"], // Add the path to your SCSS files
  },
};

export default nextConfig;
