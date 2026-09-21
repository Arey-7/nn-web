/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [400, 640, 828, 1080, 1280, 1920, 2048],
    imageSizes: [120, 240, 360, 600],
  },
};

module.exports = nextConfig;
