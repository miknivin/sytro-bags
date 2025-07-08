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
      {
        protocol: "https",
        hostname: "d229x2i5qj11ya.cloudfront.net",
        pathname: "/**", // Optional: Restrict to /uploads/ path
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
