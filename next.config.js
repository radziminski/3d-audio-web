/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERSION_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
