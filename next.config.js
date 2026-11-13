/** @type {import('next').NextConfig} */
const optimizedImages = require("next-optimized-images");

const nextConfig = optimizedImages({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    return config;
  },
  optimizeImagesInDev: true,
  images: {
    disableStaticImages: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
});

module.exports = nextConfig;
