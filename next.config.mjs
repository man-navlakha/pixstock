import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/tamplate',
        destination: '/templates',
        permanent: false,
      },
      {
        source: '/templates-builder',
        destination: '/templates',
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
