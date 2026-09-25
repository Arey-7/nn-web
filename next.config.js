/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [400, 640, 828, 1080, 1280, 1920, 2048],
    imageSizes: [120, 240, 360, 600],
  },

  redirects() {
    return [
      {
        // A short path to bookmark for the internal costing tool. Nothing on
        // the site links to it; it exists so the tool can be reached without
        // remembering the full path, and it lands on the password screen like
        // any other way in.
        //
        // 307 rather than 308: a permanent redirect is cached by the browser
        // indefinitely, which would be awkward to undo if this ever moves.
        source: "/internal",
        destination: "/quote-calculator",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
