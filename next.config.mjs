/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: ["./styles"], // Add the path to your SCSS files
  },
};

export default nextConfig;
