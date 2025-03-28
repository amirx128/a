import type { NextConfig } from "next";



/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint موقع بیلد نادیده گرفته می‌شه
  },
};

module.exports = nextConfig;