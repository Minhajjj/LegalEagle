import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell the bundler not to bundle these server-only packages on the client
  // side. This dramatically reduces compile times in dev mode.
  serverExternalPackages: [
    "pdf-parse",
    "langchain",
    "@langchain/openai",
    "@langchain/textsplitters",
    "openai",
    "selenium-webdriver",
    "chromedriver",
  ],
};

export default nextConfig;
