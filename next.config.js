// next.config.js

require("dotenv").config();
const webpack = require("webpack");
module.exports = {
  experimental: {
    esmExternals: false,
  },
  images: {
    domains: [
      "ebc-ecom-data-1-new.s3.ap-south-1.amazonaws.com",
      "ebc-ecom-data-1.s3.us-east-2.amazonaws.com",
      "localhost",
      "ecostance-ebc.s3.amazonaws.com",
      "",
    ],
  },
  env: {
    PUBLIC_URL: process.env.NEXT_PUBLIC_UI_URL,
    PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
  },
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
};


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   distDir: "build",
// };

// module.exports = nextConfig;
