/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@smithy", "util-stream"],
  },
  sassOptions: {
    includePaths: ["./styles"], // Add the path to your SCSS files
  },
};

export default nextConfig;
