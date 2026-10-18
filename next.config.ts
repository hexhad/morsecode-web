import type { NextConfig } from "next";

/**
 * Static export: the site is plain HTML/CSS/JS, so it runs on GitHub Pages (under
 * /morsecode-web, via PAGES_BASE_PATH set in the deploy workflow) and on Vercel with
 * the defaults, like the other HEXHAD product sites.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
